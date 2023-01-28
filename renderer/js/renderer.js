
const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const img1 = document.querySelector('#img-1');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');
const icoform = document.querySelector('#ico_form');
const imageToResize = document.querySelector('#resize-section');;
const widthInput1 = document.querySelector('#width_1');
const img_res = document.querySelector('#img-resize');
const img_convert = document.querySelector('#img-convert');
const btn = document.querySelector('#btn');
const NOTIFICATION_TITLE = 'Upload failed'
const NOTIFICATION_SIZE_BIG = 'Large files cannot be uploaded !'
const NOTIFICATION_TYPE_ERROR = 'Only image type is accepted !'
const NOTIFICATION_NO_FILE = 'Please provide a valid image !'

function loadImage(e) {
    const file = e.target.files[0];


    // che file is image
    const imageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/tiff',
    ]

    if (!imageTypes.includes(file.type)) {
        new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_TYPE_ERROR })
        Toastify.toast({
            text: NOTIFICATION_TYPE_ERROR,
            duration: 3000,
            newWindow: true,
            gravity: "top", // `top` or `bottom`
            position: 'center', // `left`, `center` or `right`
            style: {
                background: "tomato",
                color: "white",
                textAlign: "center",
            },
            stopOnFocus: true, // Prevents dismissing of toast on hover
            onClick: function () {
                console.log('toast clicked')
            } // Callback after click
        })
        return;
    }
    const fileSize = file.size / 1024 / 1024;
    if (fileSize > 8) {


        new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_SIZE_BIG })
        Toastify.toast({
            text: NOTIFICATION_SIZE_BIG,
            duration: 3000,
            newWindow: true,
            gravity: "top", // `top` or `bottom`
            position: 'center', // `left`, `center` or `right`
            style: {
                background: "tomato",
                color: "white",
                textAlign: "center",
            },
            stopOnFocus: true, // Prevents dismissing of toast on hover
            onClick: function () {
                console.log('toast clicked')
            } // Callback after click
        })
        return;
    }

    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = function () {
        const height = this.height;
        const width = this.width;
        URL.revokeObjectURL(this.src);
        filename.innerHTML = file.name;
        heightInput.value = height;
        widthInput.value = width;
    }

    form.style.display = 'block';
    img_convert.style.display = 'none';

    outputPath.innerHTML = path.join(os.homedir(), 'imageresizer');





}




function Alert(type, text) {

    Toastify.toast(
        {
            text: text,
            duration: 3000,
            newWindow: true,
            gravity: "top", // `top` or `bottom`
            position: 'center', // `left`, `center` or `right`
            style: {
                background: type ? "#198754" : "tomato",
                color: "white",
                textAlign: "center",
            },
            stopOnFocus: true, // Prevents dismissing of toast on hover
        }
    )
}


function imageResizer(e) {
    e.preventDefault();
    const file = img.files[0];

    if (!file) {
        Toastify.toast(
            {
                text: NOTIFICATION_NO_FILE,
                duration: 3000,
                newWindow: true,
                gravity: "top", // `top` or `bottom`
                position: 'center', // `left`, `center` or `right`
                style: {
                    background: "tomato",
                    color: "white",
                    textAlign: "center",
                },
                stopOnFocus: true, // Prevents dismissing of toast on hover
            }
        )
    }
    const imgPath = file.path;
    const height = heightInput.value;
    const width = widthInput.value;

    ipcRenderer.send('image:resize', {
        imgPath,
        height,
        width,
    });




}

ipcRenderer.on('image:done', () => {

    Toastify.toast(
        {
            text: `Image resized to ${heightInput.value} x ${widthInput.value}`,
            duration: 6000,
            newWindow: true,
            gravity: "top", // `top` or `bottom`
            position: 'center', // `left`, `center` or `right`
            style: {
                background: "#198754",
                color: "white",
                textAlign: "center",
            },
            stopOnFocus: true, // Prevents dismissing of toast on hover
        }
    )

    new Notification("Image Resizer", { body: `Image resized to ${heightInput.value} x ${widthInput.value}` })
})


ipcRenderer.on('conversion:done', () => {

    Toastify.toast(
        {
            text: `Image has been converted successfully !`,
            duration: 6000,
            newWindow: true,
            gravity: "top", // `top` or `bottom`
            position: 'center', // `left`, `center` or `right`
            style: {
                background: "#198754",
                color: "white",
                textAlign: "center",
            },
            stopOnFocus: true, // Prevents dismissing of toast on hover
        }
    )

    new Notification("Image Resizer", { body: 'Image has been converted successfully !' })
})


function imageConvert(e) {
    e.preventDefault();
    const file = img1.files[0];

    if (!file) {
        Toastify.toast(
            {
                text: NOTIFICATION_NO_FILE,
                duration: 3000,
                newWindow: true,
                gravity: "top", // `top` or `bottom`
                position: 'center', // `left`, `center` or `right`
                style: {
                    background: "tomato",
                    color: "white",
                    textAlign: "center",
                },
                stopOnFocus: true, // Prevents dismissing of toast on hover
            }
        )
    }
    const width = widthInput1.value;
    const imgPath = file.path;
    let fileName = file.name.split('.')[0] + '_' + width + 'x' + width;
    console.log(fileName)
    // replace empty spaces
    fileName = fileName.replace(/\s/g, '_');

    ipcRenderer.send('image:convert', {
        imgPath,
        fileName,
        width,
    });

}












// testing image conversion 

function loadImageToConvert(e) {
    const file = e.target.files[0];


    // che file is image
    const imageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/tiff',
    ]

    if (!imageTypes.includes(file.type)) {
        new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_TYPE_ERROR })
        Toastify.toast({
            text: NOTIFICATION_TYPE_ERROR,
            duration: 3000,
            newWindow: true,
            gravity: "top", // `top` or `bottom`
            position: 'center', // `left`, `center` or `right`
            style: {
                background: "tomato"
            },
            stopOnFocus: true, // Prevents dismissing of toast on hover
            onClick: function () {
                console.log('toast clicked')
            } // Callback after click
        })
        return;
    }
    const fileSize = file.size / 1024 / 1024;
    if (fileSize > 8) {


        new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_SIZE_BIG })
        Toastify.toast({
            text: NOTIFICATION_SIZE_BIG,
            duration: 3000,
            newWindow: true,
            gravity: "top", // `top` or `bottom`
            position: 'center', // `left`, `center` or `right`
            style: {
                background: "tomato"
            },
            stopOnFocus: true, // Prevents dismissing of toast on hover
            onClick: function () {
                console.log('toast clicked')
            } // Callback after click
        })
        return;
    }



    icoform.style.display = 'block';
    imageToResize.style.display = 'none';
    form.style.display = 'block';
    img_res.style.display = 'none';

}

img.addEventListener('change', loadImage);
form.addEventListener('submit', imageResizer)
img1.addEventListener('change', loadImageToConvert);
btn.addEventListener('click', imageConvert)
