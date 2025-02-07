
function filterArray(array, criterion) {
    return array.filter(item => {
        for (let key in criterion) {
            if (typeof criterion[key] === 'function') {
                if (!criterion[key](item[key])) {
                    return false;
                }
            } else {
                if (item[key] !== criterion[key]) {
                    return false;
                }
            }
        }
        return true;
    });
}

const tab = [
    { id: 1, nom: "PC", prix: 1200 },
    { id: 2, nom: "Telephone", prix: 25 },
    { id: 3, nom: "Télé", prix: 45 },
    { id: 4, nom: "Trotinette", prix: 300 }
];

const filter = filterArray(tab, { price: value => value < 100 });
console.log("Éléments filtrés:", filter);

//retour console:
//Éléments filtrés: (2) [{…}, {…}]0: {id: 2, nom: 'Telephone', prix: 25}1: {id: 3, nom: 'Télé', prix: 45}length: 2[[Prototype]]: Array(0)
