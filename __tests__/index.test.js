import Nightmare from 'nightmare';
import "babel-polyfill";
const nightmare = new Nightmare({ show: true });
test('check render', async () => {
    const dirpath =`file:///${process.cwd().split(`\\`).join('/')}/dist/index.html`;
    console.log(dirpath);
    await nightmare
            .goto(dirpath)
            .wait('ymaps')
            .type('#addressLine', 1 + '\r')
            .type('#addressLine', 2 + '\r')
            .type('#addressLine', 3 + '\r')
            .mousedown('.pointlist__point[data-id="1"] .pointlist__point_remove')
    let itmsLength = await nightmare.evaluate(() => {
        return document.querySelectorAll('.pointlist__point').length;
    });
    expect(itmsLength).toBe(2);
});