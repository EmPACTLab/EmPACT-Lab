# Google Sheets Form Integration Setup

## Your Google Sheet
**Sheet URL:** https://docs.google.com/spreadsheets/d/1oXM2KC_2T0DW08d9vipVmAVSgMAdS8BcNcmUVlPjPJY/edit

---

## Step-by-Step Setup Instructions

### Step 1: Prepare Your Google Sheet
1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1oXM2KC_2T0DW08d9vipVmAVSgMAdS8BcNcmUVlPjPJY/edit
2. Make sure the first row has these column headers (add them if not present):
   - **Timestamp**
   - **Name**
   - **Email**
   - **Phone**
   - **Subject**
   - **Message**

### Step 2: Create Google Apps Script
1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy and paste this code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Append the data to the sheet
    sheet.appendRow([
      data.timestamp || new Date(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.subject || '',
      data.message || ''
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data received successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional)
function testDoPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        name: 'Test User',
        email: 'test@example.com',
        phone: '+65 1234 5678',
        subject: 'Test Subject',
        message: 'This is a test message'
      })
    }
  };
  
  var result = doPost(testData);
  Logger.log(result.getContent());
}
```

4. Click the **Save** icon (💾) and name your project (e.g., "Contact Form Handler")

### Step 3: Deploy as Web App
1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**
3. Fill in the deployment settings:
   - **Description**: "Contact Form v1"
   - **Execute as**: Me (your@email.com)
   - **Who has access**: Anyone
4. Click **Deploy**
5. You may need to authorize the script:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to [Project Name] (unsafe)**
   - Click **Allow**
6. **IMPORTANT:** Copy the **Web app URL** - it will look like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

### Step 4: Update Your Website
1. Open `contact.html` in your website folder
2. Find this line (around line 119):
   ```javascript
   const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your Web app URL from Step 3
4. Uncomment the fetch code (remove the `/*` and `*/` around lines 135-143)
5. Remove or comment out the simulation code (lines 146-147)

### Step 5: Test the Form
1. Open your website and go to the Contact page
2. Fill out the form and submit
3. Check your Google Sheet - a new row should appear with the form data!

---

## Troubleshooting

### Form doesn't submit
- Make sure you completed Step 4 and updated the SCRIPT_URL
- Check browser console for errors (F12 → Console tab)
- Verify the Google Apps Script is deployed with "Who has access: Anyone"

### Data not appearing in sheet
- Check the column headers match exactly: Timestamp, Name, Email, Phone, Subject, Message
- Make sure the script is deployed (not just saved)
- Try running the `testDoPost()` function in Apps Script to verify it works

### Authorization issues
- Re-deploy the script and re-authorize
- Make sure you're the owner of the Google Sheet

---

## Current Status

✅ Contact form styled to match website design
✅ Form validation added
✅ Success/error messages implemented
✅ Google Apps Script code provided
⏳ **You need to:** Set up the Google Apps Script and update the SCRIPT_URL

---

## Features of the New Form

- 🎨 Matches website design with red accents
- ✅ Form validation (required fields)
- 📱 Responsive design
- 🔄 Loading states while submitting
- ✅ Success/error messages
- 🎯 Focus effects on inputs
- 📊 Data saved to Google Sheets automatically

---

**Need Help?** If you run into issues, check the browser console (F12) for error messages.
