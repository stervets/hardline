import { Body, Controller, Get, Post } from '@nestjs/common';
import { registerUser } from './bootstrap/bootstrap.service';

@Controller()
export class AppController {
  @Get()
  index() {
    return `<!doctype html>
<html>
<head><meta charset="utf-8"/><title>Hardline</title></head>
<body style="font-family: system-ui; max-width: 640px; margin: 40px auto; background-color: #111; color: #AAA;">
  <h1>Hardline</h1>

  <div style="display:grid; gap:10px;">
    <input id="serverPassword" placeholder="Server password"  style="background-color: #222; color: #aaa;"/>
    <input id="displayName" placeholder="Display name" style="background-color: #222; color: #aaa;" />
    <input id="sipPassword" placeholder="SIP password" style="background-color: #222; color: #aaa;" />
    <button id="go"  style="background-color: #56A;">Create number</button>
  </div>

  <pre id="out" style="margin-top:20px; padding:12px; background:#111; color:#0f0; border-radius:8px;"></pre>

<script>
  document.getElementById('go').onclick = async () => {
    const payload = {
      serverPassword: document.getElementById('serverPassword').value,
      displayName: document.getElementById('displayName').value,
      sipPassword: document.getElementById('sipPassword').value,
    };

    const r = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const txt = await r.text();
    document.getElementById('out').textContent = txt;
  };
</script>
</body>
</html>`;
  }
}
