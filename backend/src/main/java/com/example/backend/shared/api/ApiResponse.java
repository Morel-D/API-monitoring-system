package com.example.backend.shared.api;

import java.time.LocalDateTime;

public class ApiResponse<T> {

    private boolean success;
    private T data;
    private String message;
    private Object errors;
    private LocalDateTime timestamp;
    private String correlationId;
    
    public ApiResponse(boolean success, T data, String message, Object errors, LocalDateTime timestamp, String correlationId) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.errors = errors;
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }

    // Backward compatible constructor (without correlationId)
    public ApiResponse(boolean success, T data, String message, Object errors, LocalDateTime timestamp) {
        this(success, data, message, errors, timestamp, null);
    }

    public boolean isSuccess() {
        return success;
    }
    public void setSuccess(boolean success) {
        this.success = success;
    }
    public T getData() {
        return data;
    }
    public void setData(T data) {
        this.data = data;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public Object getErrors() {
        return errors;
    }

    public void setErrors(Object errors) {
        this.errors = errors;
    }
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getCorrelationId() {
        return correlationId;
    }

    public void setCorrelationId(String correlationId) {
        this.correlationId = correlationId;
    }


    
}
