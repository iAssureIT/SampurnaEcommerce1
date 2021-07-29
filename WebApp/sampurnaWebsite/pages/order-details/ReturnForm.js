import { useState } from 'react';
import { useS3Upload, getImageData } from 'next-s3-upload';
import Image from 'next/image';
import Style from './index.module.css';

export default function ReturnForm() {
  let [imageUrl, setImageUrl] = useState();
  let [height, setHeight] = useState();
  let [width, setWidth] = useState();
  let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

  let handleFileChange = async file => {
    let { url } = await uploadToS3(file);
    let { height, width } = await getImageData(file);
    setWidth(width);
    setHeight(height);
    setImageUrl(url);
    console.log("Image url==", url);
  };

  return (
    <div className={"col-12 mt-4 mb-4 pt-4 " + Style.ReturnImg} >

      <FileInput onChange={handleFileChange} />

      <div className="col-4 pull-left" onClick={openFileDialog}>Upload file</div>

      {imageUrl && (
        <div>
          <Image src={imageUrl} width={width} height={height} />
          <div>{imageUrl}</div>
          <div>
            {height}x{width}
          </div>
        </div>
      )}
    </div>
  );
}