# Stripe Test — BetaTech

> Nguồn: https://docs.stripe.com/testing  
> Chỉ dùng khi `pk_test_` / `sk_test_` (Test mode). Không dùng thẻ thật.

## Thẻ hay dùng

| Mục đích | Số thẻ | Ghi chú |
|----------|--------|---------|
Visa debit:        4000 0566 5566 5556
Mastercard:        5555 5555 5555 4444
Mastercard debit:  5200 8282 8282 8210
Amex:              3782 822463 10005
Discover:          6011 1111 1111 1117
JCB:               3566 0020 2036 0505
UnionPay:          6200 0000 0000 0005
| ✅ Thành công | `4242 4242 4242 4242` | Visa — dùng mặc định |
| ❌ Số thẻ sai | `4242 4242 4242 4241` | incorrect_number |
Generic decline:   4000 0000 0000 0002
Insufficient fund: 4000 0000 0000 9995
Lost card:         4000 0000 0000 9987
Stolen card:       4000 0000 0000 9979
Expired card:      4000 0000 0000 0069
Incorrect CVC:     4000 0000 0000 0127
---

## Stripe Link (popup email / OTP)

| OTP nhập | Kết quả |
|----------|---------|
| `000000` hoặc bất kỳ (trừ bảng dưới) | ✅ Thành công |
| `000001` | ❌ Mã sai |
| `000002` | ❌ Mã hết hạn |
| `000003` | ❌ Quá số lần thử |

*Link nhớ thẻ theo **email trình duyệt**, không theo tài khoản BetaTech.*

---

## Kiểm tra sau test

### F12 → Network
- `POST orders` → 201
- `POST payment/intent` → 200
- `POST payment/confirm` → 200

### HeidiSQL — `orders`
| COD | Stripe |
|-----|--------|
| `payment_method=cod` | `payment_method=stripe` |
| `payment_status=unpaid` | `payment_status=paid` |
| `status=pending` | `status=paid` |

### Stripe Dashboard
https://dashboard.stripe.com → **Test mode** → Payments


- Thẻ theo quốc gia, 3D Secure, dispute: https://docs.stripe.com/testing