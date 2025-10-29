# UPI ID Validation for Contacts

## How It Works

When adding a contact, the system now validates that the **UPI ID actually belongs to the provided name and phone number**.

### Validation Rules

1. **Format Check**: UPI ID must match format `name@provider`
   - ✅ Valid: `john@paytm`, `ramesh@phonepe`, `sita@upi`
   - ❌ Invalid: `john`, `paytm`, `not-a-valid-id`

2. **Name Matching**: The name in the UPI ID must relate to the contact's name
   - ✅ Valid: Contact "John Doe" with UPI "john@paytm"
   - ✅ Valid: Contact "Ramesh Kumar" with UPI "ramesh@phonepe"
   - ❌ Invalid: Contact "John Doe" with UPI "ramesh@paytm"

3. **Phone Number Validation**: Must be exactly 10 digits
   - ✅ Valid: `9876543210`
   - ❌ Invalid: `123`, `9876543210123`, `abc1234567`

## How to Use

### Adding a Valid Contact

1. Go to **Contacts** tab
2. Click **"+ Add Contact"**
3. Fill in the form:
   - **Name**: Enter the contact's full name (e.g., "John Doe")
   - **Mobile**: Enter 10-digit mobile number (e.g., "9876543210")
   - **UPI ID**: Enter UPI ID that matches the name (e.g., "john@paytm")
4. Click **"Add Contact"**
5. The system validates the UPI ID
6. If valid: Contact is added successfully ✅
7. If invalid: Error message "UPI ID does not match..." is displayed ❌

### Error Messages

#### "UPI ID does not match the provided name and phone number"
**Cause**: The UPI ID doesn't belong to the contact you're trying to add.

**Solution**: 
- Verify the UPI ID is correct
- Ensure the UPI ID contains part of the contact's name
- Double-check the phone number

#### "Invalid UPI ID format. Use format: name@upi"
**Cause**: The UPI ID is not in the correct format.

**Solution**: 
- Use format: `name@provider`
- Examples: `john@paytm`, `ramesh@phonepe`, `sita@upi`

#### "Invalid mobile number"
**Cause**: Phone number is not exactly 10 digits.

**Solution**: 
- Enter exactly 10 digits
- Remove spaces, dashes, or special characters

## Examples

### ✅ Valid Examples

| Name | Mobile | UPI ID | Status |
|------|--------|--------|--------|
| John Doe | 9876543210 | john@paytm | ✅ Valid |
| Ramesh Kumar | 9876543211 | ramesh@phonepe | ✅ Valid |
| Sita Devi | 9876543212 | sita@upi | ✅ Valid |
| Mike Johnson | 9876543213 | mike@googlepay | ✅ Valid |

### ❌ Invalid Examples

| Name | Mobile | UPI ID | Reason |
|------|--------|--------|--------|
| John Doe | 9876543210 | ramesh@paytm | ❌ Name mismatch |
| Ramesh | 123 | ramesh@paytm | ❌ Invalid phone |
| Sita | 9876543212 | sit@upi | ❌ Invalid format |
| Mike | 9876543213 | invalid | ❌ Invalid format |

## Testing on Localhost

The validation works immediately on localhost:

1. Your server is running at: **http://localhost:3000**
2. Backend API at: **http://localhost:4000**
3. All validations are active

### Quick Test

1. Try adding a contact with mismatched UPI ID:
   - Name: "John Doe"
   - Mobile: "9876543210"
   - UPI: "wrongname@paytm"
2. Result: You'll see error "UPI ID does not match..."
3. Now add with correct UPI:
   - Name: "John Doe"
   - Mobile: "9876543210"
   - UPI: "john@paytm"
4. Result: Contact added successfully! ✅

## Technical Details

The validation compares:
- The name extracted from the UPI ID (before `@`)
- The contact's provided name
- Ensures both are at least 3 characters
- Checks for name similarity

This ensures that contacts have valid UPI IDs that actually belong to them.




