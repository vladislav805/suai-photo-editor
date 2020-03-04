export const openChoosePhotoDialog = async(): Promise<File> => new Promise<File>(resolve => {
    const elem = document.createElement('input');
    elem.type = 'file';
    elem.accept = 'image/*';

    elem.onchange = () => resolve(elem.files[0]);
    elem.click();
});

export const readFile = async(file: Blob): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = evt => {
            if (evt.target.readyState === FileReader.DONE) {
                resolve(evt.target.result as string)
            }
        }
    });
}
