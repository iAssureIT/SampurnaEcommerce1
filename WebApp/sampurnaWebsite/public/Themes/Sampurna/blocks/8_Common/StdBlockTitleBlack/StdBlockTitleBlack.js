import React from 'react';


function StdBlockTitleBlack(props){
    return(
		<div className="col-12 stdBlockTitleBlackWrapper">
			<h2 className="my-5 stdBlockTitleBlack" dangerouslySetInnerHTML={ { __html:props.blockTitle}} exact></h2>
	    </div>
	)
}


export default StdBlockTitleBlack;