'use strict';

(() => {

    const documents = document.getElementById('documents'),
        calendar = document.getElementById('calendar'),
        menu = document.querySelector('.menu'),
        menuItems = menu.getElementsByTagName('li'),
        menuLength = menuItems.length,
        dropdown = documents.querySelector('.default'),
        url = './data/menu.json',
        network = new Network();

    document.addEventListener('DOMContentLoaded', () => {
        addListeners();
    });

    const addListeners = () => {
        for (let i = 0; i < menuLength; i++) {
            menuItems[i].addEventListener('click', () => {

                if (isDropdownItem(i)) {
                    openMenu();

                } else if (isDropdownAlredyOpen()) {
                    toggleDropdownMenu();
                    calendar.removeAttribute('style')
                }
            });
        }
    };

    const isDropdownItem = (i) => {
        return documents === menuItems[i] && !documents.classList.contains('show');
    };

    const isDropdownAlredyOpen = () => {
        return documents.classList.contains('show');
    };

    const openMenu = () => {
        if (isDropdownMenuEmptyYet()) {
            network.loadMenuItems(url, data => {

                const items = createDropdownItems(data);
                addDropdownItemsToHtml(items);
                openDropdownMenu();
            });
        } else {
            openDropdownMenu();
        }
    };

    const isDropdownMenuEmptyYet = () => {
        return dropdown.childElementCount === 0;
    };

    const createDropdownItems = (data) => {
        const menuItems = [];

        for (let i = 0; i < data.length; i++) {
            let li = document.createElement('li');
            let a = document.createElement('a');
            let content = document.createTextNode(data[i]);
            a.appendChild(content);
            li.appendChild(a);
            menuItems.push(li);
        }

        return menuItems;
    };

    const addDropdownItemsToHtml = (items) => {
        for (let i = 0; i < items.length; i++) {
            dropdown.appendChild(items[i]);
        }
    };

    const openDropdownMenu = () => {
        const marginTop = dropdown.childElementCount * 47;
        calendar.style.marginTop = `${marginTop}px`;
        toggleDropdownMenu();
    };

    const toggleDropdownMenu = () => {
        documents.classList.toggle('show');
        dropdown.classList.toggle('expanded');
    };

})();