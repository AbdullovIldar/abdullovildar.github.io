import Nightmare from 'nightmare';
import "babel-polyfill";
import {Item} from '../src/js/Item';
const pointList = document.createElement('ul');
const nightmare = new Nightmare({ show: true });
test('check item-object', () => {
    for (let i = 0; i <3; i++) {
        const item = new Item({
            pointlist: pointList, 
            itemClassName: 'pointlist__point',
            text: 'item ' + i,
            id: i
        });
        item.create();
    }
    const items = pointList.querySelectorAll('.pointlist__point');
    expect(items.length).toBe(3);
    expect(items[2].dataset.id).toBe("2");
    expect(items[1].textContent).toBe('item 1');
})

test('check render', async () => {
    const dirpath =`file:///${process.cwd().split(`\\`).join('/')}/dist/index.html`;
    console.log(dirpath);
    await nightmare
            .goto(dirpath)
            .wait('ymaps')
            .type('#addressLine', 1 + '\r')
            .type('#addressLine', 2 + '\r')
            .type('#addressLine', 3 + '\r')
            .mousedown('.pointlist__point[data-id="0"] .pointlist__point_remove')
    let itmsLength = await nightmare.evaluate(() => {
        return document.querySelectorAll('.pointlist__point').length;
    });
    expect(itmsLength).toBe(2);
});