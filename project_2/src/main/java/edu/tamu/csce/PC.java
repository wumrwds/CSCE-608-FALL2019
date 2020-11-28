package edu.tamu.csce;

import com.google.common.hash.Hashing;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;


class Disk {
    private Map<String, List<Block>> blocks = new HashMap<>();

    private Map<String, Integer> currentReadIdx = new HashMap<>();

    public void setReadIdxToHead(String filename) {
        currentReadIdx.put(filename, 0);
    }

    public boolean hasNextBlock(String filename) {
        // get current read index
        Integer idx = currentReadIdx.getOrDefault(filename, 0);

        // get blocks of this file
        List<Block> blocks = this.blocks.get(filename);

        return idx < blocks.size();
    }

    public Block readBlock(String filename) {
        // get current read index
        Integer idx = currentReadIdx.getOrDefault(filename, 0);

        // get blocks of this file
        List<Block> blocks = this.blocks.get(filename);

        if (idx >= blocks.size()) {
            // reach the tail, return null
            throw new IndexOutOfBoundsException("Out of block list index.");
        }

        // get block
        Block block = blocks.get(idx);

        // idx++
        currentReadIdx.put(filename, idx+1);

        return block;
    }

    public void writeBlock(String filename, Block block) {
        // get the block list of the given file; if there's no list instance, create one
        List<Block> blocks = this.blocks.getOrDefault(filename, new ArrayList<>());

        this.blocks.put(filename, blocks);

        // add the new block to the tail
        blocks.add(block);
    }

    public void deleteFile(String filename) {
        // remove the block list instance
        blocks.remove(filename);
    }

    public void deleteFilesWithPrefix(String prefix) {
        // record all the matched keys
        List<String> matchedKeys = new LinkedList<>();
        for (String key : blocks.keySet()) {
            if (key.startsWith(prefix)) {
                matchedKeys.add(key);
            }
        }

        // remove entries
        for (String key : matchedKeys) {
            blocks.remove(key);
        }
    }
}

class Memory {
    protected static final int TOTAL_BLOCK = 15;

    private Block[] blocks = new Block[TOTAL_BLOCK];

    public void setBlock(int blockId, Block block) {
        if (blockId < 0 || blockId >= TOTAL_BLOCK) {
            throw new IllegalArgumentException("block id out of range");
        }

        blocks[blockId] = block;
    }

    public Block getBlock(int blockId) {
        if (blockId < 0 || blockId >= TOTAL_BLOCK) {
            throw new IllegalArgumentException("block id out of range");
        }

        return blocks[blockId];
    }
}

class Block {
    protected static final int CAPACITY = 8;

    private List<Object[]> tuples = new ArrayList<>(CAPACITY);

    public List<Object[]> getTuples() {
        return tuples;
    }

    public void addTuple(Object[] tuple) {
        tuples.add(tuple);
    }

    public boolean isFull() {
        return tuples.size() >= 8;
    }

    public int size() {
        return tuples.size();
    }
}

public class PC {
    private Disk disk = new Disk();
    private Memory memory = new Memory();

    private boolean readFromDiskToMem(String filename, int blockId) {
        try {
            // read from disk
            Block block = disk.readBlock(filename);

            // set the block read from disk to the specified memory bucket
            memory.setBlock(blockId, block);

            return true;
        }
        catch (Exception e) {
            return false;
        }
    }

    private void writeFromMemToDisk(String filename, int blockId) {
        // get the specified memory block
        Block block = memory.getBlock(blockId);

        // write the block to disk
        disk.writeBlock(filename, block);
    }

    private int hash(int value) {
        return Hashing.sha256().hashInt(value).asInt() & 0x7fffffff;
    }

    public void join(String relation1, int keyIdx1, String relation2, int keyIdx2) {
        // hash the relations and store the hashed buckets back into the disk
        // the path of hashed buckets is named as '{relation}-hashed-{bucket #}'
        hashRelation(relation1, keyIdx1);
        hashRelation(relation2, keyIdx2);

        // we assume the relation 1 is always the smaller table compared to relation 2
        // TODO you can check the size of relation 1 and 2 in the beginning of this method
        // also, we assume every bucket of relation 1 can be contained within (Memory.TOTAL_BLOCK - 2) blocks

        // iterate all hashed buckets (we used (Memory.TOTAL_BLOCK - 1) buckets to hash tuples before)
        disk.deleteFile(String.format("%s-%s-joined", relation1, relation2));
        for (int i = 0; i < Memory.TOTAL_BLOCK - 1; i++) {
            String bucketFilePath1 = String.format("%s-hashed-%d", relation1, i);
            String bucketFilePath2 = String.format("%s-hashed-%d", relation2, i);

            // 1. read all blocks of this bucket in relation 1 to the main memory
            int idx = 0;
            disk.setReadIdxToHead(bucketFilePath1);
            while (disk.hasNextBlock(bucketFilePath1)) {
                readFromDiskToMem(bucketFilePath1, idx++);
            }

            // 2. read all blocks of this bucket in relation 2 to one block of the main memory one by one, then join
            memory.setBlock(idx + 1, new Block());
            Block resultBlock = memory.getBlock(idx + 1);
            disk.setReadIdxToHead(bucketFilePath2);
            while (disk.hasNextBlock(bucketFilePath2)) {
                readFromDiskToMem(bucketFilePath2, idx);

                // 3. apply join
                // for every tuple of bucket j in relation 2, iterate all tuples in relation 1's bucket j
                for (Object[] tuple2 : memory.getBlock(idx).getTuples()) {
                    // TODO use a hashmap to replace this loop so that this part can be speed up
                    for (int j = 0; j < idx; j++) {
                        for (Object[] tuple1 : memory.getBlock(j).getTuples()) {
                            if (tuple1[keyIdx1].equals(tuple2[keyIdx2])) {
                                int colSize = tuple1.length + tuple2.length - 1;
                                Object[] newTuple = new Object[colSize];
                                for (int p = 0; p < tuple1.length; p++) {
                                    newTuple[p] = tuple1[p];
                                }
                                for (int p = 0, q = tuple1.length; p < tuple2.length; p++) {
                                    if (p == keyIdx2) {
                                        // if it's the joined key, skip
                                        continue;
                                    }
                                    newTuple[q++] = tuple2[p];
                                }

                                if (resultBlock.isFull()) {
                                    writeFromMemToDisk(String.format("%s-%s-joined", relation1, relation2), idx + 1);
                                    resultBlock = new Block();
                                    memory.setBlock(idx + 1, resultBlock);
                                }

                                resultBlock.addTuple(newTuple);
                            }
                        }
                    }
                }
            }

            // dump the remained block in memory after completing one bucket
            writeFromMemToDisk(String.format("%s-%s-joined", relation1, relation2), idx + 1);
        }
    }

    private void hashRelation(String relation, int keyIdx) {
        int memorySize = Memory.TOTAL_BLOCK;

        // set n - 1 empty blocks in memory for hashing
        for (int i = 0; i < memorySize-1; i++) {
            memory.setBlock(i, new Block());
        }

        // read blocks to the (n-1)-th block
        // before read, set the read index to the head
        disk.setReadIdxToHead(relation);
        disk.deleteFilesWithPrefix(String.format("%s-hashed", relation));

        while (disk.hasNextBlock(relation)) {
            // 1. read the block of relation to the (n-1)-th index of the main memory
            readFromDiskToMem(relation, memorySize-1);

            // 2. then hash the tuples inside this block to the 0 to n-2 blocks
            //    during the hash, once a block is full, call `writeFromMemToDisk()` to write the
            //    full block back to disk. After that, create a new empty blcok at its previous index
            for (Object[] tuple : memory.getBlock(memorySize - 1).getTuples()) {
                // get hashed index so that we know where the current tuple should go
                Integer val = (Integer) tuple[keyIdx];
                int hashedIdx = hash(val.intValue()) % (memorySize - 1);


                Block selectedBlock = memory.getBlock(hashedIdx);
                if (selectedBlock.isFull()) {
                    // if the selected block is full, dump it into disk
                    writeFromMemToDisk(String.format("%s-hashed-%d", relation, hashedIdx), hashedIdx);

                    // then create a new block instance at the hashed index in the main memory
                    selectedBlock = new Block();
                    memory.setBlock(hashedIdx, selectedBlock);
                }

                // add tuple into the hashed block it belongs to
                selectedBlock.addTuple(tuple);
            }
        }

        // iterate the 0 to n-2 block in the main memory, dump them
        for (int i = 0; i < memorySize-1; i++) {
            writeFromMemToDisk(String.format("%s-hashed-%d", relation, i), i);
        }
    }

    private static List<Object[]> genRelationS(int rows, int start, int end) {
        List<Object[]> relation = new ArrayList<>(rows);
        for (int i = 0; i < rows; i++) {
            // generate column B and column C
            Integer colB = ThreadLocalRandom.current().nextInt(start, end);
            String colC = UUID.randomUUID().toString();
            relation.add(new Object[]{colB, colC});
        }

        return relation;
    }

    private static List<Object[]> genRelationR(List<Object[]> S, int rows) {
        List<Object[]> relation = new ArrayList<>(rows);
        for (int i = 0; i < rows; i++) {
            int pickedIdx = ThreadLocalRandom.current().nextInt(0, S.size());
            String colA = UUID.randomUUID().toString().replace("-", "");
            Integer colB = (Integer) S.get(pickedIdx)[0];
            relation.add(new Object[]{colA, colB});
        }
        return relation;
    }

    private static List<Block> tuplesToBlocks(List<Object[]> tuples) {
        int blockCapacity = Block.CAPACITY;

        List<Block> blocks = new ArrayList<>(tuples.size() / blockCapacity + 1);
        Block currentBlock = new Block();
        for (int i = 0; i < tuples.size(); i++) {
            if (currentBlock.isFull()) {
                blocks.add(currentBlock);
                currentBlock = new Block();
            }

            currentBlock.addTuple(tuples.get(i));
        }

        // add the last block
        blocks.add(currentBlock);

        return blocks;
    }

    public static void main(String[] args) {
        PC pc = new PC();

        int sizeOfS = 5000, sizeOfR = 1000;
        int[] randomRange = new int[] {10000, 50000};
        int testNum = 20;

        // generate relation S and R
        List<Object[]> relationS = genRelationS(sizeOfS, randomRange[0], randomRange[1]);
        List<Object[]> relationR = genRelationR(relationS, sizeOfR);

        // convert relation tuples into blocks
        List<Block> sBlocks = tuplesToBlocks(relationS);
        List<Block> rBlocks = tuplesToBlocks(relationR);

        // write relation S and R into the disk in advance
        pc.disk.deleteFile("S");
        for (Block block : sBlocks) {
            pc.disk.writeBlock("S", block);
        }

        pc.disk.deleteFile("R");
        for (Block block : rBlocks) {
            pc.disk.writeBlock("R", block);
        }

        pc.join("R", 1, "S", 0);


        for (int i = 0; i < testNum; i++) {
            int idx = ThreadLocalRandom.current().nextInt(sizeOfS);

            System.out.println("\r\n=================================================\r\n");
            Integer selectedB = (Integer) relationS.get(idx)[0];
            System.out.println("Selected B: " + selectedB);
            System.out.println("\r\n------------- Matched tuples in S ---------------\r\n");
            for (Object[] tuple : search(relationS, 0, selectedB)) {
                System.out.println(Arrays.toString(tuple));
            }
            System.out.println("\r\n------------- Matched tuples in R ---------------\r\n");
            for (Object[] tuple : search(relationR, 1, selectedB)) {
                System.out.println(Arrays.toString(tuple));
            }
            System.out.println("\r\n---------------- Joined Results ------------------\r\n");
            String joinedResultPath = String.format("%s-%s-joined", "R", "S");
            pc.disk.setReadIdxToHead(joinedResultPath);
            while (pc.disk.hasNextBlock(joinedResultPath)) {
                for (Object[] tuple : pc.disk.readBlock(joinedResultPath).getTuples()) {
                    if (tuple[1] == selectedB) {
                        System.out.println(Arrays.toString(tuple));
                    }
                }
            }
            System.out.println("\r\n=========================================\r\n");
        }

        System.out.println("Finish joining R(A, B) and S(B, C), the results are stored in 'R-S-joined'");
    }

    public static List<Object[]> search(List<Object[]> tuples, int col, Object target) {
        List<Object[]> matched = new ArrayList<>();
        for (Object[] tuple : tuples) {
            if (tuple[col].equals(target)) {
                matched.add(tuple);
            }
        }
        return matched;
    }
}
