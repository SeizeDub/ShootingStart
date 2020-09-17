let blockPageElt = document.getElementById('block-page');
let blackScreenElt = document.getElementById('black-screen');
let categoryElts = document.getElementsByClassName('category');
let categoryBlurElts = document.getElementsByClassName('category-blur');

let signetModif, categoryModif;
let signetNumber, categoryNumber;
let imageUrl, imageName;
let dropBlock, dropZone;

if (navigator.language == 'fr' || navigator.language == 'fr-FR') {
    document.getElementById('signet-title-input').placeholder = 'Titre';
    document.getElementById('signet-imagelink-input').placeholder = "URL de l'image";
    document.getElementById('background-imagelink-input').placeholder = "URL de l'image";
    document.getElementById('signet-imagesearch-button').textContent = 'Parcourir';
    document.getElementById('background-imagesearch-button').textContent = 'Parcourir';
    document.getElementById('newcategory-button').textContent = 'Créer une nouvelle catégorie';
    document.getElementById('signet-delete').textContent = 'Supprimer';
    document.getElementById('category-delete').textContent = 'Supprimer';
    document.getElementById('signet-cancel').textContent = 'Annuler';
    document.getElementById('category-cancel').textContent = 'Annuler';
    document.getElementById('background-cancel').textContent = 'Annuler';
    document.getElementById('signet-validate').textContent = 'Appliquer';
    document.getElementById('category-validate').textContent = 'Appliquer';
    document.getElementById('background-validate').textContent = 'Appliquer';
    document.getElementById('background-modiftext').textContent = "Changer l'image de fond d'écran";
    document.getElementById('category-renametext').textContent = 'Renommer la catégorie';
    for (element of document.getElementsByClassName('small-row')) element.classList.add('french');
}

let database = {
    categories : [],
    background : {
        url : "url('images/background.jpg')"
    }
}

let db, request = indexedDB.open('ShootingStartDatabase', 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;
    db.createObjectStore('database', {autoIncrement: true}).transaction.oncomplete = () => {
        db.transaction('database', 'readwrite').objectStore('database').add(database);
    }
}

request.onsuccess = (event) => {
    db = event.target.result;
    db.transaction('database', 'readwrite').objectStore('database').get(1).onsuccess = (event) => {
        categoryNumber = 0;
        data = event.target.result;
        blockPageElt.style.backgroundImage = data.background.url;
        for (category of data.categories) {
            insertCategory(category.name);
            categoryModif = categoryElts[categoryNumber];
            for (signet of category.signets) {
                insertSignet(signet.titre, signet.lien, signet.imagedata);
            }
            categoryNumber++;
        }
        if (categoryElts.length == 0) showBackgroundMenu();
    }
}

function showBlackScreen () {
    blackScreenElt.style.display = 'flex';
    blockPageElt.style.filter = 'blur(2px)';
}

function hideBlackScreen () {
    blackScreenElt.style.display = 'none';
    blockPageElt.style.filter = 'blur(0px)';
    hideMenus();
}

function hideMenus () {
    for (menu of document.getElementsByClassName('menu')) {
        menu.style.display = 'none';
    }
}

function newCategory() {
    hideBlackScreen();
    db.transaction('database', 'readwrite').objectStore('database').get(1).onsuccess = (event) => {
        data = event.target.result;
        newdata = {name : 'Category', signets : []};
        data.categories.push(newdata);
        db.transaction('database', 'readwrite').objectStore('database').put(data, 1);
        insertCategory('Category');
    }
}

function insertCategory(name) {
    element = document.createElement('div');
    element.className = 'category';
    element.setAttribute('draggable', 'true');
    element2 = document.createElement('div');
    element2.className = 'titlecontainer';
    element3 = document.createElement('div');
    element3.className = 'titre';
    element3.textContent = name;
    element5 = document.createElement('div');
    element5.className = 'new-signet-button';
    element2.appendChild(element3);
    element2.appendChild(element5);
    element.appendChild(element2);
    blockPageElt.appendChild(element);
}

function newSignet() {
    hideBlackScreen();
    categoryNumber =  Array.prototype.indexOf.call(categoryElts, categoryModif);
    db.transaction('database', 'readwrite').objectStore('database').get(1).onsuccess = (event) => {
        data = event.target.result;
        newdata = {titre : '', lien : '#', imagedata : ''};
        data.categories[categoryNumber].signets.push(newdata);
        db.transaction('database', 'readwrite').objectStore('database').put(data, 1);
        insertSignet('','#','');
    }
}

function insertSignet(titre,lien,imagedata) {
    element = document.createElement('a');
    element.className = 'signet';
    element.href = lien;
    element.setAttribute('draggable', 'true');
    element2 = document.createElement('div');
    element2.className = 'image';
    element2.style.backgroundImage = imagedata;
    element3 = document.createElement('div');
    element3.className = 'textbox';
    element3.textContent = titre;
    element.appendChild(element2);
    element.appendChild(element3);
    categoryModif.appendChild(element);
}

function showBackgroundMenu() {
    showBlackScreen();
    if (categoryElts.length > 4) {
        document.getElementById('newcategory-button').classList.add('inactive');
    }
    else {
        document.getElementById('newcategory-button').classList.remove('inactive');
    }
    document.getElementById('background-imagename-field').textContent = '';
    document.getElementById('background-imagelink-input').value = '';
    imageUrl = window.getComputedStyle(blockPageElt, null).getPropertyValue('background-image');
    document.getElementById('background-imagebox').style.backgroundImage = imageUrl;
    document.getElementById('background-menu').style.display = 'flex';
}

function backgroundValidate() {
    hideBlackScreen();
    db.transaction('database', 'readwrite').objectStore('database').get(1).onsuccess = (event) => {
        data = event.target.result;
        data.background.url = imageUrl;
        db.transaction('database', 'readwrite').objectStore('database').put(data, 1);
        blockPageElt.style.backgroundImage = imageUrl;
    }
}

function showCategoryMenu () {
    showBlackScreen();
    categoryModif = event.target.parentNode.parentNode;
    categoryNumber = Array.prototype.indexOf.call(categoryElts, categoryModif);
    document.getElementById('category-input').value = categoryModif.getElementsByClassName('titre')[0].textContent;
    document.getElementById('category-menu').style.display = 'flex';
    document.getElementById('category-input').select();
}

function categoryValidate() {
    hideBlackScreen();
    db.transaction('database', 'readwrite').objectStore('database').get(1).onsuccess = (event) => {
        data = event.target.result;
        data.categories[categoryNumber].name = document.getElementById('category-input').value;
        db.transaction('database', 'readwrite').objectStore('database').put(data, 1);
        categoryModif.getElementsByClassName('titre')[0].textContent = document.getElementById('category-input').value;
    }
}

function cateogryDelete() {
    hideBlackScreen();
    db.transaction('database', 'readwrite').objectStore('database').get(1).onsuccess = (event) => {
        data = event.target.result;
        data.categories.splice(categoryNumber, 1);
        db.transaction('database', 'readwrite').objectStore('database').put(data, 1);
        categoryModif.parentNode.removeChild(categoryModif);
    }
}

function showSignetMenu () {
    showBlackScreen();
    signetModif = event.target.parentNode;
    signetNumber = Array.prototype.indexOf.call(signetModif.parentNode.getElementsByClassName('signet'), signetModif);
    categoryNumber = Array.prototype.indexOf.call(categoryElts, signetModif.parentNode);
    imageUrl = window.getComputedStyle(signetModif.getElementsByClassName('image')[0], null).getPropertyValue('background-image');
    document.getElementById('signet-imagename-field').textContent = '';
    document.getElementById('signet-imagelink-input').value = '';
    document.getElementById('signet-title-input').value = signetModif.getElementsByClassName('textbox')[0].textContent;
    if (signetModif.href.endsWith('shootingstart.html#')) {
        document.getElementById('signet-link-input').value = '';
    } else {
        document.getElementById('signet-link-input').value =  signetModif.href;
    }
    document.getElementById('signet-imagebox').style.backgroundImage = imageUrl;
    document.getElementById('signet-menu').style.display = 'flex';
    document.getElementById('signet-title-input').select();
}

function signetValidate() {
    hideBlackScreen();
    db.transaction('database', 'readwrite').objectStore('database').get(1).onsuccess = (event) => {
        data = event.target.result;
        signet = data.categories[categoryNumber].signets[signetNumber];
        signet.titre = document.getElementById('signet-title-input').value;
        signetModif.getElementsByClassName('textbox')[0].textContent = document.getElementById('signet-title-input').value;
        if (document.getElementById('signet-link-input').value) {
            signet.lien = document.getElementById('signet-link-input').value;
            signetModif.href = document.getElementById('signet-link-input').value;
        } else {
            signet.lien = '#';
            signetModif.href = '#';
        }
        signet.imagedata = imageUrl;
        signetModif.getElementsByClassName('image')[0].style.backgroundImage = imageUrl;
        db.transaction('database', 'readwrite').objectStore('database').put(data, 1);  
    }
}

function signetDelete() {
    hideBlackScreen();
    db.transaction('database', 'readwrite').objectStore('database').get(1).onsuccess = (event) => {
        data = event.target.result;
        data.categories[categoryNumber].signets.splice(signetNumber, 1);
        db.transaction('database', 'readwrite').objectStore('database').put(data, 1);
        signetModif.parentNode.removeChild(signetModif);
    }
}

function inputFile(menu, file) {
    imageName = file.name;
    document.getElementById(`${menu}-imagename-field`).textContent = imageName;
    reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
        imageUrl = `url(${event.target.result})`;
        document.getElementById(`${menu}-imagebox`).style.backgroundImage = imageUrl;
    }
}

function inputLink(menu) {
    document.getElementById(`${menu}-imagename-field`).textContent = '';
    imageUrl = `url(${document.getElementById(menu + "-imagelink-input").value})`;
    document.getElementById(`${menu}-imagebox`).style.backgroundImage = imageUrl;
}

window.oncontextmenu = (event) => {
    event.preventDefault();
    if (event.target.id == 'block-page') {
        showBackgroundMenu();
    } else if (event.target.classList.contains('titre')) {
        showCategoryMenu();
    } else if ((event.target.classList.contains('image')) || (event.target.classList.contains('textbox'))) {
        showSignetMenu();
    }
}

window.onclick = (event) => {
    if (event.target.classList.contains('new-signet-button')) {
        categoryModif = event.target.parentNode.parentNode;
        if (categoryModif.getElementsByClassName('signet').length < 10) newSignet();
    } else {
        switch (event.target.id) {
            case 'newcategory-button': 
                if (categoryElts.length < 5) newCategory();
                break;
            case 'signet-cancel':
            case 'background-cancel':
            case 'category-cancel':
                hideBlackScreen();
                break;
            case 'signet-delete':
                signetDelete();
                break;
            case 'category-delete':
                cateogryDelete();
                break;
            case 'category-validate':
                categoryValidate();
                break;
            case 'signet-validate':
                signetValidate();
                break;
            case 'background-validate':
                backgroundValidate();
                break;
            case 'signet-imagesearch-button':
                document.getElementById('signet-imagesearch-input').click();
                break;
            case 'background-imagesearch-button':
                document.getElementById('background-imagesearch-input').click();
                break;
        }
    }
}

window.onchange = (event) => {
    if (event.target == document.getElementById('signet-imagesearch-input')) {
        file = event.target.files[0];
        inputFile('signet', file);
    } else if (event.target == document.getElementById('background-imagesearch-input')) {
        file = event.target.files[0];
        inputFile('background', file);
    }
}

window.oninput = (event) => {
    if (event.target == document.getElementById('signet-imagelink-input')) {
        inputLink('signet');
    } else if (event.target == document.getElementById('background-imagelink-input')) {
        inputLink('background');
    }
}

window.ondragover = (event) => {
    event.preventDefault();
}

blackScreenElt.ondrop = (event) => {
    event.preventDefault();
    file = event.dataTransfer.files[0];
    if (file.type.split('/')[0] != 'image') return;
    if (event.target == document.getElementById('signet-imagebox')) inputFile('signet', file);
    else if (event.target == document.getElementById('background-imagebox')) inputFile('background', file);
}

blockPageElt.ondragstart = (event) => {
    dropBlock = event.target;
}

blockPageElt.ondrop = (event) => {
    event.preventDefault();
    if (dropBlock.classList.contains('category')) {
        position = 0;
        for (category of categoryElts) {
            if (event.clientX > (category.getBoundingClientRect().left + category.getBoundingClientRect().right) / 2)
                position ++;
        }
        db.transaction('database', 'readwrite').objectStore('database').get(1).onsuccess = (event) => {
            data = event.target.result;
            categoryNumber = Array.prototype.indexOf.call(categoryElts, dropBlock);
            if (position < categoryNumber) {
                data.categories.splice(position, 0, data.categories.splice(categoryNumber, 1)[0]);
            } else if (position > categoryNumber) {
                data.categories.splice(position-1, 0, data.categories.splice(categoryNumber, 1)[0]);
            }
            db.transaction('database', 'readwrite').objectStore('database').put(data, 1);
            blockPageElt.insertBefore(dropBlock, categoryElts[position]);
        }
    } else if (dropBlock.nodeName === 'A') {
        if (event.target.classList.contains('textbox') || event.target.classList.contains('image') || event.target.classList.contains('new-signet-button') || event.target.classList.contains('titre')) {
            dropZone = event.target.parentNode.parentNode;
        } else if (event.target.classList.contains('category')) {
            dropZone = event.target;
        } else return;
        position = 0;
        for (signet of dropZone.getElementsByClassName('signet')) {
            if (event.clientY > (signet.getBoundingClientRect().top + signet.getBoundingClientRect().bottom) / 2)
                position ++;
        }
        if ((dropZone.getElementsByClassName('signet').length < 10) || (dropBlock.parentNode == dropZone)) {
            db.transaction('database', 'readwrite').objectStore('database').get(1).onsuccess = (event) => {
                data = event.target.result;
                signetNumber = Array.prototype.indexOf.call(dropBlock.parentNode.getElementsByClassName('signet'), dropBlock);
                categoryNumber = Array.prototype.indexOf.call(categoryElts, dropBlock.parentNode);
                if (dropBlock.parentNode == dropZone) {
                    if (position < signetNumber)
                        data.categories[categoryNumber].signets.splice(position, 0, data.categories[categoryNumber].signets.splice(signetNumber, 1)[0]);
                    else if (position > signetNumber)
                        data.categories[categoryNumber].signets.splice(position-1, 0, data.categories[categoryNumber].signets.splice(signetNumber, 1)[0]);
                } else {
                    dropCategoryNumber = Array.prototype.indexOf.call(categoryElts, dropZone);
                    data.categories[dropCategoryNumber].signets.splice(position, 0, data.categories[categoryNumber].signets[signetNumber]);
                    data.categories[categoryNumber].signets.splice(signetNumber, 1);
                }
                db.transaction('database', 'readwrite').objectStore('database').put(data, 1);
                dropZone.insertBefore(dropBlock, dropZone.getElementsByClassName('signet')[position]);
            }
        }
    }
}