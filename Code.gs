/**
 * =========================================================
 * LINEミニアプリ風 予約システム用 Google Apps Script (GAS)
 * =========================================================
 * 
 * [概要]
 * 1. Googleカレンダーと連携して「空き時間」の一覧を返します。
 * 2. 予約情報を受け取り、カレンダーに新しい予定を追加します。
 */

// ---------------------------------------------------------
// 設定項目 (必要に応じて変更してください)
// ---------------------------------------------------------

// カレンダーID ('primary'はこのGASを作成したアカウントのメインカレンダー)
// 別の共有カレンダーを使う場合は 'xxx@group.calendar.google.com' などを指定
const CALENDAR_ID = 'primary'; 

// 予約を受け付ける時間帯 (例: 10:00 〜 19:00 の間)
const START_HOUR = 10;
const END_HOUR = 19;

// 1枠の予約時間 (分)
const SLOT_DURATION = 60;

// 定休日 (0:日, 1:月, 2:火, 3:水, 4:木, 5:金, 6:土)
// 例: 日曜と月曜を休みにする場合 -> [0, 1]
const REGULAR_HOLIDAYS = [];

// ---------------------------------------------------------

/**
 * [GETリクエスト]
 * index.htmlから日付をパラメータで受け取って、その日の「予約可能な時間帯」を返す
 * リクエスト例: https://script.google.com/macros/s/xxx/exec?date=2026-03-08
 */
function doGet(e) {
  try {
    const dateStr = e.parameter.date;
    if (!dateStr) {
      return createJsonResponse({ error: '日付が指定されていません' }, 400);
    }

    const targetDate = new Date(dateStr);
    
    // 定休日チェック
    if (REGULAR_HOLIDAYS.includes(targetDate.getDay())) {
      return createJsonResponse({ availableSlots: [] }); // 定休日は空きなし
    }

    // 指定日の開始時刻と終了時刻をセット
    const startTime = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), START_HOUR, 0, 0);
    const endTime = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), END_HOUR, 0, 0);

    const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
    const events = calendar.getEvents(startTime, endTime);

    let availableSlots = [];
    let currentTime = new Date(startTime);

    // 開始時間から終了時間まで SLOT_DURATION 刻みでループ
    while (currentTime < endTime) {
      let slotEnd = new Date(currentTime.getTime() + SLOT_DURATION * 60000);
      let isConflict = false;

      // 既存の予定と重複しているかチェック
      for (let i = 0; i < events.length; i++) {
        let evStart = events[i].getStartTime();
        let evEnd = events[i].getEndTime();
        // 予約枠の時間が予定に被っている場合
        if (currentTime < evEnd && slotEnd > evStart) {
          isConflict = true;
          break;
        }
      }

      // 予定と被っていなければ空き時間として追加
      if (!isConflict) {
        let h = ('0' + currentTime.getHours()).slice(-2);
        let m = ('0' + currentTime.getMinutes()).slice(-2);
        availableSlots.push(`${h}:${m}`);
      }

      // 次の時間枠へ (この例では SLOT_DURATION 分進める。例：1時間ずつ)
      // 仮に「予約は1時間だけど、30分刻みで予約枠を受け付けたい」場合はここを別の変数にします
      currentTime = slotEnd; 
    }

    return createJsonResponse({ availableSlots: availableSlots });
    
  } catch (error) {
    return createJsonResponse({ error: error.message }, 500);
  }
}

/**
 * [CORS対応] POSTリクエスト前に送信されるOPTIONSリクエストに対応
 */
function doOptions(e) {
  return createJsonResponse({ status: 'ok' });
}

/**
 * [POSTリクエスト]
 * index.htmlから送られてきた予約データをカレンダーに登録する
 */
function doPost(e) {
  try {
    // 送信されたJSONデータを取得
    const postData = JSON.parse(e.postData.contents);
    const name = postData.name;
    const dateStr = postData.date; // 例: 2026-03-08
    const timeStr = postData.time; // 例: 10:00
    const memo = postData.memo;

    if (!name || !dateStr || !timeStr) {
      return createJsonResponse({ error: '必須項目が不足しています' }, 400);
    }

    const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
    
    // 予約日時を生成
    const [year, month, day] = dateStr.split('-');
    const [hour, minute] = timeStr.split(':');
    
    // 月は0始まりのため -1 する
    const eventStart = new Date(year, month - 1, day, hour, minute);
    const eventEnd = new Date(eventStart.getTime() + SLOT_DURATION * 60000);

    // カレンダーに予定を追加 (同時間帯にダブルブッキングされるのを防ぐ処理が必要な場合は事前の重複チェックを入れます)
    const title = `[予約] ${name} 様`;
    const description = `=== 自動予約システムからの受付 ===\n\n【お名前】\n${name} 様\n\n【ご要望・メモ】\n${memo || 'なし'}\n\n============================`;
    
    calendar.createEvent(title, eventStart, eventEnd, {
      description: description
    });

    return createJsonResponse({ success: true, message: '予約が完了しました' });
    
  } catch (error) {
    return createJsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * レスポンスを構築するヘルパー関数
 * （Webアプリとして公開し、「全員(匿名ユーザー)」からアクセス可能なJSON APIとする）
 */
function createJsonResponse(data, code = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
