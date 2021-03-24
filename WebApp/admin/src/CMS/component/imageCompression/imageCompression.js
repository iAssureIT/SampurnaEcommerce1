import S3FileUpload from 'react-s3';
import convert from 'image-file-resize';

const Compress = require('compress.js');

export const imageCompressor = (files,config,width,height)=>{
    return new Promise(resolve => {
    var file = files[0];
    //to rename image start
    var today = new Date();    
    var date = today.getFullYear()+"" + (today.getMonth() +1)+"" + today.getDate();
    var time = today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
    var ext = file.name.split('.').pop();
    var name = file.name;
    var filename = name.split('.').slice(0, -1).join('.')

    Object.defineProperty(file, 'name', {
      writable: true,
      value: filename+'_'+date+time+'.'+ext
    }); 
    convert({ 
      file: file,  
      width: width ? width : 600, 
      height: height ? height : 400, 
      type: ext
      }).then(resp => {
        // Response contain compressed and resized file
        S3FileUpload
        .uploadFile(file,config)
        .then((Data)=>{
          console.log("success data",Data) 
          resolve(Data);
        })
        .catch((error)=>{
          console.log(error);
        })

      }).catch(error => {
           // Error
      })
    })
}
