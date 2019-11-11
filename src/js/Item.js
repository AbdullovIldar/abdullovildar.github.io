export class Item {
    constructor (internal) {
        this.pointlist = internal.pointlist,
        this.pointItem = document.createElement('li'),
        this.removeKey = document.createElement('span'),
        this.itemClassName = internal.itemClassName,
        this.text = internal.text,
        this.needFunction = internal.eventFunction,
        this.id = internal.id
    }

    createItem() {
        this.pointItem.classList.add(this.itemClassName);
        this.removeKey.classList.add(this.itemClassName + '_remove');
        this.pointItem.textContent = this.text;
        this.pointItem.dataset.id = this.id;
        this.pointItem.append(this.removeKey);
        this.removeKey.addEventListener('mousedown', (event) => {
            event.stopPropagation();
            this.pointItem.remove();
            this.needFunction('remove');
        })
        this.pointlist.append(this.pointItem);
        this.pointItem.addEventListener('mousedown', e => this._movetItem(e));
    }

    _movetItem (event) {
        const itemLayout = document.createElement('li');
        itemLayout.classList.add(this.itemClassName);
        itemLayout.style.border = 'none'
        const anotherItems = [...this.pointlist.querySelectorAll('.' + this.itemClassName)]
                            .filter(item => item.dataset.id != this.pointItem.dataset.id);
        const itemtHeight = this.pointlist.scrollHeight / (anotherItems.length + 1);
        const shiftY = event.clientY - this.pointItem.getBoundingClientRect().top;
        const getLocation = (elem) => {
           return elem.getBoundingClientRect().top + pageYOffset;
        };
        const parentLocation = getLocation(this.pointlist);
        const newSiblingNum = (pageY) => {
            return Math.round(pageY / itemtHeight);
        }
        const moveTo = (event) => {
            const needLocation = event.pageY - parentLocation - shiftY ;
            if (needLocation >= 0) {
                const siblingNum = newSiblingNum(needLocation);
                const newSibling = anotherItems[siblingNum];
                this.pointItem.style.top = needLocation + 'px';
                if(newSibling) {
                    newSibling.before(itemLayout);
                } else if (anotherItems.length > 0) {
                    anotherItems[anotherItems.length - 1].after(itemLayout);
                }
            }
        }
        this.pointItem.style.position = 'absolute';
        this.pointItem.style.zIndex = '999';
        moveTo(event);
        window.addEventListener('mousemove', moveTo);
        window.addEventListener('mouseup', ()=>{
            this.pointItem.style.position = 'static';
            this.pointItem.style.zIndex = '1';
            itemLayout.replaceWith(this.pointItem);
            itemLayout.remove();
            window.removeEventListener('mousemove', moveTo);
            this.needFunction('mouseup');
            window.onmouseup = null;
        })
    }
}