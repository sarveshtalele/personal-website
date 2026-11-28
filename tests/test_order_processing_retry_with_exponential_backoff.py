"""
Test Suite for Order Processing Retry with Exponential Backoff
"""
import pytest
from app.order_processing_retry_with_exponential_backoff import OrderProcessingRetrywithExponentialBackoffService


def test_order_processing_retry_with_exponential_backoff_nominal():
    service = OrderProcessingRetrywithExponentialBackoffService()
    res = service.execute({"key": "test_value"})
    assert res["status"] == "SUCCESS"
    assert res["feature"] == "Order Processing Retry with Exponential Backoff"


def test_order_processing_retry_with_exponential_backoff_invalid():
    service = OrderProcessingRetrywithExponentialBackoffService()
    with pytest.raises(ValueError):
        service.execute({})
