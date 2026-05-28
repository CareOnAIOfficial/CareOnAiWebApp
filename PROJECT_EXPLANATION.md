# AI Careon App - Full Project Explanation

This document explains the whole website/application so a developer, teacher, teammate, or AI coding tool can understand the project quickly and safely.

## 1. Project Summary

AI Careon is a React web application for monitoring a patient who is at risk of developing bed sores. The app connects to Firebase for authentication and real-time patient data.

The main idea is:

- A patient is lying on a smart bed or mattress.
- Sensors connected to an ESP32 collect readings such as pressure, temperature, humidity, heart rate, oxygen level, and moisture.
- The ESP32 sends the readings to Firebase Realtime Database.
- The React website reads the Firebase data and displays it to a nurse or caregiver.
- The website also allows the user to send control commands back to Firebase, such as raising the bed, triggering an air pump, or sending an emergency stop command.

The project is a frontend web app only. It does not contain the ESP32 firmware and it does not contain a custom backend server. Firebase acts as the backend.

## 2. Tech Stack

The project uses:

- React for the user interface.
- Vite for development and production builds.
- Tailwind CSS for styling.
- Firebase Authentication for login and account creation.
- Firebase Realtime Database for sensor data, history, controls, settings, and patient profile.
- React Router for page routing.
- Recharts for charts on the History page.
- React Icons for sidebar and alert icons.
- ESLint for code checking.

Important files:

```txt
package.json
vite.config.js
src/main.jsx
src/App.jsx
src/services/firebase.js
src/hooks/useAuth.js
src/hooks/usePatientData.js
src/pages/LoginPage.jsx
src/pages/DashboardPage.jsx
src/pages/HistoryPage.jsx
src/pages/AlertsPage.jsx
src/pages/ControlPage.jsx
src/pages/SettingsPage.jsx
src/components/Navbar.jsx
src/components/ProtectedRoute.jsx
src/components/SensorGauge.jsx
src/components/RiskScoreBar.jsx
src/components/ActuatorStatus.jsx
```

## 3. How To Run The Website

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Check code with ESLint:

```bash
npm run lint
```

Preview the production build:

```bash
npm run preview
```

## 4. Firebase Setup

Firebase is configured in:

```txt
src/services/firebase.js
```

This file initializes:

- Firebase App
- Realtime Database
- Authentication

It also exports Firebase helper functions so other files can import them from one place.

Current exports include:

```js
app
database
auth
ref
onValue
set
get
signInWithEmailAndPassword
createUserWithEmailAndPassword
signOut
onAuthStateChanged
```

The project supports Vite environment variables:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

There is an example file:

```txt
.env.example
```

For local development, the current `firebase.js` also includes fallback Firebase values so the project can still work if `.env.local` is missing.

For a cleaner production setup, create:

```txt
.env.local
```

and put the real Firebase config values there.

Important Firebase Console settings:

- Firebase Authentication must be enabled.
- Email/Password sign-in must be enabled.
- Realtime Database must be created.
- Realtime Database rules must allow the logged-in user to read and write the correct patient paths.

## 5. Authentication Flow

Authentication is handled by Firebase Auth.

The login/register page is:

```txt
src/pages/LoginPage.jsx
```

The page has:

- Email input
- Password input
- Submit button
- Toggle button to switch between Sign In and Create Account
- Error message area

When the user is signing in, the app calls:

```js
signInWithEmailAndPassword(auth, email, password)
```

When the user is creating an account, the app calls:

```js
createUserWithEmailAndPassword(auth, email, password)
```

If authentication succeeds, React Router navigates to:

```txt
/
```

which is the Dashboard page.

If authentication fails, the app converts common Firebase errors into friendlier messages:

- `auth/invalid-credential` becomes `Invalid email or password`
- `auth/configuration-not-found` becomes a message telling the developer to enable Firebase Authentication
- `auth/email-already-in-use` becomes `Email already registered`
- `auth/weak-password` becomes `Password must be at least 6 characters`

## 6. Route Protection

Protected pages use:

```txt
src/components/ProtectedRoute.jsx
```

This component calls:

```txt
src/hooks/useAuth.js
```

`useAuth` listens to Firebase Auth state using:

```js
onAuthStateChanged(auth, callback)
```

If Firebase is still checking the login state, the app shows a loading spinner.

If there is no logged-in user, the app redirects to:

```txt
/login
```

If there is a logged-in user, the protected page is shown.

Protected pages include:

- Dashboard
- History
- Alerts
- Bed Control
- Settings

## 7. App Routing

Routes are defined in:

```txt
src/App.jsx
```

The project uses `BrowserRouter`, `Routes`, and `Route` from React Router.

Routes:

```txt
/login      LoginPage
/           DashboardPage
/history    HistoryPage
/alerts     AlertsPage
/control    ControlPage
/settings   SettingsPage
```

Most pages are lazy loaded using React `lazy()` and wrapped in `Suspense`. This means the page JavaScript is loaded only when needed.

Protected pages are wrapped in:

```jsx
<ProtectedRoute>
  <AppLayout>
    <SomePage />
  </AppLayout>
</ProtectedRoute>
```

`AppLayout` adds the sidebar navigation and the main content area.

## 8. Navigation Sidebar

The navigation sidebar is:

```txt
src/components/Navbar.jsx
```

It contains links to:

- Dashboard
- History
- Alerts
- Bed Control
- Settings

It also has a Logout button.

Logout calls:

```js
signOut(auth)
```

After logout, the app navigates to:

```txt
/login
```

The active link is styled differently using `NavLink`.

## 9. Firebase Realtime Database Structure

The app currently assumes one patient:

```txt
patient_001
```

Most database reads and writes are under:

```txt
patients/patient_001
```

Expected Firebase structure:

```json
{
  "patients": {
    "patient_001": {
      "latest": {
        "timestamp": 1710000000,
        "risk_score": 45,
        "fsr_raw": 2300,
        "temperature": 36.8,
        "humidity": 55,
        "heart_rate": 82,
        "spo2": 97,
        "pressure_duration": 1200,
        "moisture_wet": false,
        "weight_kg": 75
      },
      "history": {
        "1710000000": {
          "risk_score": 45,
          "fsr_raw": 2300,
          "temperature": 36.8,
          "humidity": 55,
          "heart_rate": 82,
          "spo2": 97,
          "pressure_duration": 1200,
          "moisture_wet": false,
          "weight_kg": 75
        }
      },
      "controls": {
        "raise_bed": false,
        "trigger_pump": false,
        "emergency_stop": false
      },
      "settings": {
        "pressure_threshold": 2800,
        "temp_high": 37.5,
        "spo2_low": 95,
        "humidity_high": 70,
        "notifications_enabled": true
      },
      "profile": {
        "name": "Patient 001",
        "age": 72,
        "weight": 75,
        "condition": "Post-surgery",
        "bed": "A",
        "ward": "ICU"
      }
    }
  }
}
```

## 10. Sensor Data Hook

Sensor data is read by:

```txt
src/hooks/usePatientData.js
```

The hook is called like this:

```js
const { latest, history, loading } = usePatientData();
```

By default, it reads:

```txt
patients/patient_001/latest
patients/patient_001/history
```

It uses Firebase `onValue`, so updates are real-time.

Returned values:

- `latest`: newest patient reading, or `null` if there is no data.
- `history`: array of the last 100 history readings.
- `loading`: true while first latest reading is loading.

The hook accepts a custom patient id:

```js
usePatientData("patient_002")
```

But the rest of the app currently hardcodes `patient_001` in many places, so multi-patient support is not fully implemented yet.

## 11. Dashboard Page

File:

```txt
src/pages/DashboardPage.jsx
```

Purpose:

- Show live sensor readings.
- Show patient risk score.
- Show actuator status.
- Show quick patient/device information.

Data source:

```js
usePatientData()
```

If loading, it shows a spinner.

If no `latest` data exists, it shows a message saying the app is waiting for the ESP32 to send data.

If data exists, it displays:

- Risk score
- Pressure sensor reading
- Temperature
- Humidity
- Heart rate
- SpO2
- Pressure duration
- Moisture status
- Weight
- Last update time
- Device status

Important fields used:

```txt
risk_score
fsr_raw
temperature
humidity
heart_rate
spo2
pressure_duration
moisture_wet
weight_kg
timestamp
```

Timestamp assumption:

```js
new Date(d.timestamp * 1000)
```

This means the timestamp is expected to be in Unix seconds, not milliseconds.

## 12. SensorGauge Component

File:

```txt
src/components/SensorGauge.jsx
```

Purpose:

- Displays one sensor value.
- Shows a colored progress bar.
- Shows Normal, Warning, or Critical.

Props:

```js
label
value
unit
min
max
icon
warning
danger
```

General rule:

- If value is below warning, status is Normal.
- If value is above warning, status is Warning.
- If value is above danger, status is Critical.

Special rule for SpO2:

- Low SpO2 is dangerous.
- Below 95 is Warning.
- Below 90 is Critical.

The component now prevents division by zero if `max` and `min` are accidentally the same.

## 13. RiskScoreBar Component

File:

```txt
src/components/RiskScoreBar.jsx
```

Purpose:

- Displays the patient bed sore risk score from 0 to 100.
- Shows a colored label and progress bar.

Risk rules:

```txt
0-39    SAFE
40-59   CAUTION
60-79   DANGER
80-100  CRITICAL
```

The score is clamped between 0 and 100 so the progress bar cannot overflow.

If score is 80 or above, the component adds the `pulse-critical` CSS class.

The animation is defined in:

```txt
src/index.css
```

## 14. ActuatorStatus Component

File:

```txt
src/components/ActuatorStatus.jsx
```

Purpose:

- Shows predicted/automatic actuator status based on risk score.

Rules:

- Air Pump is active when risk score is 60 or higher.
- Vibration is active when risk score is between 40 and 59.
- Bed Tilt is active when risk score is 80 or higher.
- Alarm is active when risk score is 80 or higher.

This component only displays status. It does not write commands to Firebase.

Actual command writing is done in `ControlPage.jsx`.

## 15. History Page

File:

```txt
src/pages/HistoryPage.jsx
```

Purpose:

- Display charts from historical sensor readings.

Data source:

```js
usePatientData()
```

History data comes from:

```txt
patients/patient_001/history
```

The hook converts Firebase object entries into an array:

```js
{
  time: parseInt(key),
  ...val
}
```

History page maps the data to:

```js
{
  time: new Date(h.time * 1000).toLocaleTimeString(),
  risk: h.risk_score || 0,
  pressure: h.fsr_raw || 0,
  temp: h.temperature || 0
}
```

Charts:

- Risk score over time using `AreaChart`
- Pressure over time using `LineChart`
- Temperature over time using `LineChart`

The page uses Recharts components:

- `ResponsiveContainer`
- `AreaChart`
- `Area`
- `LineChart`
- `Line`
- `XAxis`
- `YAxis`
- `CartesianGrid`
- `Tooltip`

## 16. Alerts Page

File:

```txt
src/pages/AlertsPage.jsx
```

Purpose:

- Build active alerts from the latest patient reading.
- Show critical and warning counts.
- Show alert cards with titles, details, severity, and current values.

Main function:

```js
buildAlerts(data)
```

Rules:

Risk score:

```txt
>= 80 critical
>= 60 warning
```

Pressure:

```txt
fsr_raw >= 3500 critical
fsr_raw >= 2800 warning
```

Temperature:

```txt
temperature >= 39 critical
temperature >= 37.5 warning
```

Humidity and moisture:

```txt
humidity >= 85 or moisture_wet true critical
humidity >= 70 warning
```

SpO2:

```txt
spo2 < 90 critical
spo2 < 95 warning
```

Pressure duration:

```txt
pressure_duration >= 3600 critical
pressure_duration >= 1800 warning
```

If there is no sensor data, the page tells the user alerts will appear after the ESP32 sends readings.

If there are no alerts, it shows `All Clear`.

## 17. Control Page

File:

```txt
src/pages/ControlPage.jsx
```

Purpose:

- Send actuator commands to Firebase.

Firebase write path:

```txt
patients/patient_001/controls/{command}
```

Commands:

```txt
raise_bed
trigger_pump
emergency_stop
```

Examples:

```js
set(ref(database, "patients/patient_001/controls/raise_bed"), true)
set(ref(database, "patients/patient_001/controls/trigger_pump"), true)
set(ref(database, "patients/patient_001/controls/emergency_stop"), true)
```

UI controls:

- Raise Bed
- Lower Bed
- Trigger Pump Cycle
- Emergency Stop

Local state:

```js
bedRaised
pumpActive
loading
```

The app uses local state to immediately update button states after a command is sent.

Important detail:

The component uses timers for pump cycle and command loading state. These timers are cleaned up when the component unmounts to avoid updating React state after leaving the page.

ESP32 expectation:

The ESP32 should listen to the `controls` path and react when a command changes. For example, when `trigger_pump` becomes true, the ESP32 can run the pump cycle.

## 18. Settings Page

File:

```txt
src/pages/SettingsPage.jsx
```

Purpose:

- Configure alert thresholds.
- Configure patient profile.
- Save settings/profile to Firebase.

Firebase read paths:

```txt
patients/patient_001/settings
patients/patient_001/profile
```

Firebase write paths:

```txt
patients/patient_001/settings
patients/patient_001/profile
```

Default settings:

```js
{
  pressure_threshold: 2800,
  temp_high: 37.5,
  spo2_low: 95.0,
  humidity_high: 70.0,
  notifications_enabled: true
}
```

Default profile:

```js
{
  name: "Patient 001",
  age: 72,
  weight: 75,
  condition: "Post-surgery",
  bed: "A",
  ward: "ICU"
}
```

The page currently saves these settings, but not every other page uses these saved thresholds yet. For example, AlertsPage currently uses hardcoded threshold values. A future improvement would be to make AlertsPage and DashboardPage read thresholds from Firebase settings.

Number inputs use a helper function:

```js
parseNumber(value, fallback)
```

This prevents accidentally saving `NaN` when a number input is cleared.

## 19. Styling

Main CSS file:

```txt
src/index.css
```

The project uses Tailwind CSS classes directly in JSX.

Visual theme:

- Dark background
- Slate panels
- Blue active navigation
- Green safe state
- Yellow warning state
- Orange danger state
- Red critical state

Custom CSS includes:

- Body styling
- Scrollbar styling
- Critical pulse animation

The critical pulse animation is used by `RiskScoreBar` when risk is 80 or higher.

## 20. Build Configuration

Vite config:

```txt
vite.config.js
```

Plugins:

```js
react()
tailwindcss()
```

The app entry point is:

```txt
src/main.jsx
```

`main.jsx` renders:

```jsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

into:

```html
<div id="root"></div>
```

from `index.html`.

## 21. Current Project Strengths

The project already has:

- Working Firebase Authentication.
- Protected routes.
- Real-time database listening.
- Live dashboard.
- Historical charts.
- Alerts based on sensor thresholds.
- Actuator command page.
- Settings/profile page.
- Lazy-loaded pages.
- Lint passing.
- Production build passing.

## 22. Important Limitations

These are not necessarily bugs, but future developers or AI tools should know them.

### 22.1 Single Patient Is Hardcoded

Most paths use:

```txt
patient_001
```

This means the app is not truly multi-patient yet.

To support multiple patients, create a selected patient state or route parameter, then pass the selected patient id into hooks and Firebase paths.

### 22.2 Settings Are Saved But Not Fully Applied

Settings are saved to Firebase, but the alert thresholds in `AlertsPage.jsx`, `DashboardPage.jsx`, and `SensorGauge.jsx` are mostly hardcoded.

Future improvement:

- Load settings with a hook.
- Use `settings.pressure_threshold`, `settings.temp_high`, `settings.spo2_low`, and `settings.humidity_high` in alerts and dashboard gauges.

### 22.3 Firebase Security Rules Are Critical

The Firebase web API key is not a private secret, but database rules are very important.

Bad rules can allow anyone to read or write patient data.

At minimum, Realtime Database rules should require authentication:

```json
{
  "rules": {
    "patients": {
      "$patientId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

For a real medical project, rules should be stricter than this. Users should only access patients they are allowed to see.

### 22.4 Medical Safety

This project should be treated as a prototype or educational system unless it goes through proper medical validation.

Do not rely on it alone for real patient safety without:

- Medical review
- Hardware validation
- Sensor calibration
- Alarm reliability testing
- Security review
- Data privacy compliance

### 22.5 No Offline Handling

The app does not currently show a strong warning when Firebase is offline or disconnected.

Future improvement:

- Track Firebase connection state.
- Show a disconnected banner.
- Disable actuator controls when offline.

### 22.6 No Role System

Any authenticated user can access protected pages if database rules allow it.

Future improvement:

- Add roles such as nurse, admin, technician.
- Store roles in Firebase custom claims or a users table.
- Restrict controls/settings to authorized users.

### 22.7 No Audit Log

Control commands such as emergency stop are written as current state only.

Future improvement:

- Log every command with timestamp, user id, command, and value.
- Example path:

```txt
patients/patient_001/command_history/{timestamp}
```

## 23. Suggested Future Improvements

High priority:

- Move Firebase config fully to `.env.local`.
- Add stricter Firebase Database rules.
- Make settings thresholds control the alert logic.
- Add Firebase error messages for database permission errors.
- Add a connection status indicator.
- Add confirmation for emergency stop or separate safety flow.

Medium priority:

- Add multi-patient support.
- Add user roles.
- Add command history/audit trail.
- Add loading and error state to Settings page.
- Add success/error toast messages for Control page commands.
- Add unit tests for `buildAlerts`.

Nice to have:

- Better mobile sidebar navigation.
- Date range filter for History page.
- Export history as CSV.
- Patient selector.
- Dark/light theme toggle.
- More detailed sensor calibration settings.

## 24. Common Errors And Meanings

### Firebase: Error auth/api-key-not-valid

The Firebase API key is wrong or missing.

Fix:

- Copy the correct web app API key from Firebase Console.
- It usually starts with `AIza`.

### Firebase: Error auth/configuration-not-found

Firebase Authentication is not enabled for the project.

Fix:

- Go to Firebase Console.
- Open Authentication.
- Enable Email/Password sign-in.

### Permission denied

Realtime Database rules do not allow the current user to read or write the path.

Fix:

- Check Firebase Realtime Database rules.
- Make sure the user is logged in.
- Make sure the path is allowed.

### No Data Yet

The website is working, but there is no data at:

```txt
patients/patient_001/latest
```

Fix:

- Make sure ESP32 is connected to WiFi.
- Make sure ESP32 writes to the exact Firebase path expected by the app.
- Make sure database rules allow writes.

## 25. Data Field Reference

### latest

```txt
timestamp
```

Unix timestamp in seconds.

```txt
risk_score
```

Number from 0 to 100 representing bed sore risk.

```txt
fsr_raw
```

Raw pressure reading from force sensitive resistor. Expected range is 0 to 4095.

```txt
temperature
```

Skin or local temperature in Celsius.

```txt
humidity
```

Humidity percentage.

```txt
heart_rate
```

Heart rate in beats per minute.

```txt
spo2
```

Oxygen saturation percentage.

```txt
pressure_duration
```

Duration in seconds that pressure has remained high or relevant.

```txt
moisture_wet
```

Boolean. True means wet/moisture detected.

```txt
weight_kg
```

Patient weight in kilograms.

## 26. How Another AI Tool Should Work On This Project

If another AI tool edits this project, it should know:

- This is a Vite React app.
- Use `npm run lint` and `npm run build` after changes.
- Do not delete Firebase config unless replacing it with a working `.env.local` setup.
- Preserve the Firebase database paths unless also updating the ESP32 code.
- Be careful with medical/safety-related actions.
- Do not assume multi-patient support exists yet.
- If changing alert thresholds, update Dashboard, Alerts, and Settings together.
- If changing controls, update both the React command path and the ESP32 listener path.
- If adding private data, update Firebase rules.

## 27. Quick Mental Model

The app can be understood like this:

```txt
Firebase Auth
    |
    v
LoginPage -> ProtectedRoute -> Main App Pages

ESP32 -> Firebase Realtime Database -> usePatientData -> Dashboard/History/Alerts

ControlPage -> Firebase Realtime Database controls -> ESP32 actuators

SettingsPage -> Firebase Realtime Database settings/profile
```

In short:

- Firebase Auth decides who can enter.
- Firebase Database stores live patient data and commands.
- React displays data and writes commands.
- ESP32 is expected to send sensor readings and listen for control commands.

