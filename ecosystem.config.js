
module.exports = {
  apps : [{
    name   : "studybuddy-app",
    script : "npm",
    args   : "start",
    env_production: {
       NODE_ENV: "production",
       // IMPORTANT: Replace this placeholder with your actual Gemini API Key
       GEMINI_API_KEY: "PASTE_YOUR_GEMINI_API_KEY_HERE"
    }
  }]
}
