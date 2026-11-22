# Лаб 1: UI автомат тест (Playwright)

Нэр: Сайнзаяа
Оюутны код: B252270209

## Юу хийсэн

[saucedemo.com](https://www.saucedemo.com) демо дэлгүүрийн нэвтрэх урсгалыг Playwright (TypeScript)-ээр автоматжуулсан. Зөвхөн Chromium-д ажиллуулна.

| Тест | Юуг шалгадаг | Гол assertion |
|---|---|---|
| амжилттай нэвтрэх | `standard_user` нэвтрээд, `Products` хуудас нээгдэж, гарах үйлдлээр дуусна | `toHaveURL`, `toHaveText`, `toBeVisible` |
| амжилтгүй нэвтрэх: буруу нууц үг | алдааны мессеж гарч, бараа бүхий хуудас руу орохгүй | `toBeVisible`, `toContainText`, `not.toHaveURL` |
| нэвтэрсний дараа бараа сагслах | сагсны тоолуур 0-ээс 1 болж, товч `Remove` болно, дараа нь гарна | `toHaveCount`, `toHaveText`, `toBeVisible` |

Тестүүд `tests/mytest.spec.ts` файлд, код дотор тайлбар коммент бичсэн. Нэвтрэх, гарах үйлдлийг `login`, `logout` функц болгож дахин ашигласан. Нэвтэрсэн тест бүр logout-оор дуусдаг. Тест бүр өөр `page` (шинэ браузер context) авдаг тул хоорондоо хамааралгүй, дангаараа ажиллана (test isolation).

## Орчин

Node.js ба Playwright хувилбар:

```
v24.20.0
Version 1.65.1
```

Хөтөч: Chrome for Testing 159.0.8154.6 (playwright chromium v1255), `npx playwright install chromium`-оор суулгасан.

## Locator-ийн сонголт: яагаад XPath биш

`getByRole`, `getByPlaceholder`, `getByTestId` ашигласан. XPath-аас зайлсхийсэн шалтгаан:

- XPath нь DOM-ийн бүтэц (тагийн дараалал, давхарга)-д хатуу уяатай. Дизайн өөрчлөгдөхөд тест эвдэрнэ. `getByRole('button', { name: 'Login' })` хэрэглэгч харж буй зүйлээр элементийг олдог тул бүтэц өөрчлөгдөхөд тэсвэртэй.
- Role/label/текст нь хүртээмж (accessibility)-ийн утгатай нийцдэг. Тест уншихад ойлгомжтой (`getByRole('button', { name: 'Logout' })`).
- Практик жишээ: би эхлээд Logout-ыг `getByRole('link', ...)` гэж бичсэн, тест унасан. Алдааны үеийн page snapshot (`error-context.md`) дээр элемент нь `button "Logout"` гэж харагдсан тул role-ийг засаад ногоон болгосон. Role-д суурилсан locator нь хуудасны жинхэнэ семантикийг шууд тусгадаг.
- `getByTestId` нь `playwright.config.ts` дотор `testIdAttribute: 'data-test'` гэж тохируулсны дараа saucedemo-ийн `data-test` атрибутаар ажиллана.

## Codegen

`npx playwright codegen --test-id-attribute=data-test -o docs/codegen-output.ts https://www.saucedemo.com` командаар нэвтрэх, сагслах, гарах урсгалыг бичүүлсэн (`docs/codegen-output.ts`). Өөрийн кодтой харьцуулсан ажиглалт:

- Codegen зөвхөн үйлдлийг бичдэг, **assertion (`expect`) нэг ч бичдэггүй**. Тиймээс түүний тест нэвтэрсэн эсэхийг шалгадаггүй. Өөрийн тест үр дүнг шалгадаг.
- Миний санамсаргүй үйлдлүүдийг (нууц үгийн самбар дээр дарсан, `Ctrl+C` дарсан) бас код болгосон. Гараар цэвэрлэх хэрэгтэй.
- Codegen нэг урт тест бичсэн: функцэд салгаагүй, тайлбар коммент байхгүй. Дахин ашиглах бүтэц, тест хуваах нь хүний ажил хэвээр.
- Locator-аар голдуу `getByTestId`, `Open Menu`-д `getByRole` сонгосон. Хоёр хувилбар хоёулаа XPath-аас тогтвортой.

## Trace viewer ба санаатайгаар унагасан тест

Тестийг `npx playwright test --trace on`-оор ажиллуулж trace viewer дээр алхам бүрийг (Before/After хуудасны зураг, Network, Console) үзсэн.

Санаатайгаар унагах: амжилттай нэвтрэх тестийн `toHaveText('Products')` assertion-ыг `toHaveText('Productz')` болгож ажиллуулсан. Үр дүн (`evidence/failed-run.txt`): `1 failed`, `2 passed`, алдаа нь `Expected: "Productz"`, `Received: "Products"`. Унасан ажиллуулалтын trace нь `evidence/trace-failed-login.zip`.

Trace viewer дээр ажигласан зүйл:

- `Expect "toHaveText"` алхам улаан болсон.
- Түүнээс хойших `Click Open Menu`, `Click Logout` алхмууд trace-д байхгүй, тест тэнд зогссон.
- Errors табанд хүлээгдсэн ба бодит утга зэрэгцэн харагдана. Тэр мөчийн хуудасны зураг дээр `Products` гэж бичигдсэн нь харагдсан тул алдаа нь хуудсанд биш, assertion-д байсныг шууд ойлгосон.

Тестийг дараа нь `git restore`-оор буцааж, 3 тест дахин ногоон болсон. Ногоон ажиллуулалтын HTML report: `evidence/html-report/index.html` (`npx playwright show-report evidence/html-report`).

## Playwright ба Selenium: ажиглалт

Playwright-ийн auto-wait нь хамгийн их мэдрэгдсэн ялгаа байлаа: би ямар ч `waitForTimeout` бичээгүй мөртлөө `Click Logout` цэс гарч ирэх хөдөлгөөн дуустал элементийг өөрөө хүлээсэн (trace дээр 941ms). Лабын зааврын харьцуулалтаар Selenium-д үүнийг explicit wait-аар гараар бичих шаардлагатай. Хөтчийг `npx playwright install chromium` гэсэн нэг командаар суулгасан, тусдаа driver хэрэггүй байсан. Trace viewer нь алхам бүрийн хуудасны зураг, Network, Errors-ийг харуулдаг тул санаатайгаар унагасан тестийн шалтгааныг шууд олсон. Унасан тест page snapshot-ыг автоматаар хадгалдаг тул Logout-ын role нь `link` биш `button` гэдгийг олоход тусалсан. Codegen нь үйлдлийг хурдан бичдэг ч assertion бичдэггүй, шаардлагагүй үйлдэл үлдээдэг тул гараар цэвэрлэх шаардлагатай. Тест бүр тусдаа context-тэй, олон worker-оор зэрэг ажилласан. Би энэ лабд Selenium-ийг өөрөө ажиллуулж үзээгүй тул Selenium-ийн тухай дүгнэлт нь лабын зааврын хүснэгтэд суурилсан, Playwright-ийн тухай нь миний өөрийн туршлага.

## Ажиллуулах

```
npm ci
npx playwright install chromium
npx playwright test
```

Төслийн бүтэц: `tests/mytest.spec.ts` (3 тест), `playwright.config.ts`, `docs/codegen-output.ts`, `evidence/` (унасан ажиллуулалтын гаралт, trace, HTML report).