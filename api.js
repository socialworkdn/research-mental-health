// ============================================================
// ตัวช่วยเรียก API (Google Apps Script Web App)
// หมายเหตุสำคัญเรื่อง CORS:
// Google Apps Script Web App ไม่สามารถตอบ preflight (OPTIONS request) ได้
// ดังนั้นฝั่ง POST เราจึงส่ง Content-Type เป็น "text/plain" แทน "application/json"
// (text/plain เป็น content-type ที่ browser ไม่ทำ preflight ให้)
// ฝั่ง server (Code.gs) จะ JSON.parse(e.postData.contents) เองอยู่แล้ว จึงไม่มีปัญหา
// ============================================================

async function apiGet(params) {
  const url = new URL(API_URL);
  Object.keys(params || {}).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.set(key, params[key]);
    }
  });

  const res = await fetch(url.toString(), { method: 'GET' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

async function apiPost(action, payload) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, payload })
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

// แปลง <form> เป็น object ธรรมดา โดยรวม checkbox ชื่อซ้ำกัน (เช่น services) เป็น array
function formToObject(form) {
  const fd = new FormData(form);
  const obj = {};
  for (const [key, value] of fd.entries()) {
    if (obj.hasOwnProperty(key)) {
      if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
      obj[key].push(value);
    } else {
      obj[key] = value;
    }
  }
  return obj;
}
