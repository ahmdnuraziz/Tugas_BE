const { index, store, update, destroy} = require('./controller/ControllerFruit.js')

let main = () => {
    console.log("Method Index - menampilkan Buah")
    index()
    console.log('-------------------------')
    console.log("Method store - Menambahkan Buah Timun")
    store("Timun")
    console.log('-------------------------')
    console.log("Method update - Update data 0 menjadi Anggur")
    update(0,"Anggur")
    console.log('-------------------------')
    console.log("Method destroy - Menghapus data 0")
    destroy(0)
    console.log('-------------------------')
}

main()