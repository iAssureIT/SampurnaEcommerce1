import React   from 'react';
import Image   from 'next/image';


const CustomRightArrow = () => {

	return(
		<div className={Style.rightArrow} > 
			<Image 
             src={"/images/eCommerce/rightArrow.png"}
             alt="ScrollToRight" 
             className={"img-responsive"}
             height={100}
             width={100} 
             layout={'intrinsic'}
           />
      </div>

	)

}

export default CustomRightArrow;