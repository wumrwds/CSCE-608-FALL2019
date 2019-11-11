package edu.tamu.wumrwds.database.entity.vo;

import com.fasterxml.jackson.annotation.JsonInclude;
import edu.tamu.wumrwds.database.util.DateTimeUtils;

import java.io.Serializable;

/**
 * A wrapper class for wrapping the response data.
 *
 * @param <T>
 * @author wumrwds
 */
@JsonInclude(
        JsonInclude.Include.NON_NULL
)
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1234378562615567947L;

    private boolean success;
    private T result;
    private String version;
    private String errorCode;
    private String errorMsg;
    private String timestamp;

    public static <V> Result<V> buildOkResponse(V obj, String version) {
        return new Result<>(true, obj, version, null, null, DateTimeUtils.currentDateTime());
    }

    public static <V> Result<V> buildErrorResponse(String errorCode, String errorMsg, String version) {
        return new Result<>(false, null, version, errorCode, errorMsg, DateTimeUtils.currentDateTime());
    }

    public Result(boolean success, T result, String version, String errorCode, String errorMsg, String timestamp) {
        this.success = success;
        this.result = result;
        this.version = version;
        this.errorCode = errorCode;
        this.errorMsg = errorMsg;
        this.timestamp = timestamp;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public T getResult() {
        return result;
    }

    public void setResult(T result) {
        this.result = result;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorMsg() {
        return errorMsg;
    }

    public void setErrorMsg(String errorMsg) {
        this.errorMsg = errorMsg;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "Result{" +
                "success=" + success +
                ", result=" + result +
                ", version='" + version + '\'' +
                ", errorCode=" + errorCode +
                ", errorMsg='" + errorMsg + '\'' +
                ", timestamp='" + timestamp + '\'' +
                '}';
    }
}
