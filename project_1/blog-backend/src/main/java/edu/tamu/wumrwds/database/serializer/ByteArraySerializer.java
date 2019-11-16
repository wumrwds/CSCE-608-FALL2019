package edu.tamu.wumrwds.database.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

/**
 * Json serializer for byte array.
 *
 * @author wumrwds
 */
public class ByteArraySerializer extends JsonSerializer<byte[]> {
    @Override
    public void serialize(byte[] value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeString(new String(value));
    }
}
