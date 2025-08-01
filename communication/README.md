
# 📲 @thinkcove/communication

A TypeScript utility to send SMS messages using [Pay2SMS](http://pay4sms.in/). Built for backend services, this library supports templated messages, custom Axios options, and integrates seamlessly with your server applications using Axios and Mustache.

---

## 🚀 Features

- ✅ Simple and reliable SMS sending via Pay2SMS  
- 📄 Supports templated messages using Mustache (`{{variable}}`)  
- 🔧 Customizable via Axios options (headers, timeouts, etc.)  
- 🔐 Designed for secure backend usage  
- 🧪 Typed interfaces for safer development  

---

## 📦 Installation

```bash
npm install @thinkcove/communication
```

---

## 🛠️ Usage

### 1. Import the function

```ts
import { sendPay2sms } from "@thinkcove/communication";
```

### 2. Configure your Pay2SMS credentials

```ts
const smsConfig = {
  smsUrl: "https://pay4sms.in/sendsms/", // Pay2SMS API endpoint
  senderId: "ABCDEF",                       // Registered sender ID
  creditType: "1",                          // "1" = Transactional, "2" = Promotional
  communicationToken: "YOUR_API_TOKEN",    // Token from Pay2SMS
  templateId: "DLT_TEMPLATE_ID"            // Approved DLT template ID
};
```

### 3. Prepare your SMS input

```ts
const input = {
  phoneNumber: "1010101010",
  template: "Hi {{name}}, your OTP is {{otp}}.",
  templateData: {
    name: "John",
    otp: "123456"
  }
};
```

### 4. (Optional) Add Axios configuration

```ts
// Optional: Customize Axios request
const axiosOptions = {
  timeout: 7000, // custom timeout (ms)
  method: "GET", // override method (default is GET)
  headers: {
    "X-App-Source": "billing-system",
    "Accept": "application/json"
  }
};

```

### 5. Send the SMS

```ts
const result = await sendPay2sms(input, smsConfig, axiosOptions);

if (result.success) {
  console.log("✅ SMS sent successfully:", result.response?.data);
} else {
  console.error("❌ SMS sending failed:", result.error);
}
```

---

## 🧩 Template Engine

This package uses [`mustache`](https://www.npmjs.com/package/mustache) to render message templates.

**Example:**

```ts
template: "Hi {{name}}, your OTP is {{otp}}.",
templateData: {
  name: "Alice",
  otp: "789456"
}
```

**Output:**

```
Hi Alice, your OTP is 789456.
```

---

## 📄 API Reference

### `sendPay2sms(input, smsConfig, axiosOptions?)`

Send an SMS using Pay2SMS with a templated message.

#### ➤ Parameters

- `input`: `SmsSendInput`  
- `smsConfig`: `SmsConfigProps`  
- `axiosOptions` *(optional)*: Additional Axios configuration (method, headers, etc.)

#### ➤ Returns

- A `Promise<SmsResponse>` containing success status, message, and response/error.

---

## 🧾 Types

### `SmsSendInput`

```ts
type SmsSendInput = {
  phoneNumber: string;
  template: string;
  templateData: Record<string, string | number | boolean>;
};
```

### `SmsConfigProps`

```ts
type SmsConfigProps = {
  smsUrl: string;
  senderId: string;
  creditType: string;
  communicationToken: string;
  templateId: string;
};
```

### `SmsResponse`

```ts
type SmsResponse = {
  success: boolean;
  message: string;
  response?: AxiosResponse;
  error?: any;
};
```

---

## 🔐 Security Best Practices

- Do **not** expose your `communicationToken` on the frontend.  
- Store credentials securely using environment variables:

```env
PAY2SMS_TOKEN=your_api_token
SENDER_ID=your_sender_id
TEMPLATE_ID=your_dlt_template_id
```

- Load environment variables using [`dotenv`](https://www.npmjs.com/package/dotenv):

```ts
import dotenv from "dotenv";
dotenv.config();
```

---

## 📎 Useful Links

- 🔗 [Pay2SMS](https://www.pay2sms.in/)

---

## 📝 License

ISC License
