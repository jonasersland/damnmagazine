export const returnFormattedTitle =(title)=>{
    if (!title.includes(':')) return title

    const editedTitle = title.slice(0, title.indexOf(':')+1) + '<br/>' + title.slice(title.indexOf(':')+1)
    function createMarkup(code) {
        return {__html: code};
    }
    return <span dangerouslySetInnerHTML={createMarkup(editedTitle)} />;
}

export function titleCase(str) {
    return str.toLowerCase().replaceAll(/(^| )(\w)/g, x => x.toUpperCase());
/*
var splitStr = str.toLowerCase().split(" ");
for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
    splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
}
return splitStr.join(" ");
*/
}



export const returnImageHeight = (asset)=>{
    const string = asset.split("-");
    const size = string[2].split("x");
    
    const getDimension =(size)=>{
        let ratio = size[0] / size[1];
        // console.log(ratio);
        if (ratio > 1.3){
            return {ratio: 'height-ratio-025', value: ratio}
        } else if (ratio <= 1.3 && ratio > 1.1){
            return {ratio: 'height-ratio-050', value: ratio}
        } else if (ratio <= 1.1 && ratio > 0.8){
            return {ratio: 'height-ratio-075', value: ratio}
        } else if (ratio <= 0.8){
            return {ratio: 'height-ratio-100', value: ratio}
        } else{
            return {ratio: 'height-ratio-100', value: 1.5}
        }
    }

    return getDimension(size)
}