import React from 'react';


function StdBlockTitleWhite(props){
    return(
		<div className="col-12 stdBlockTitleWhiteWrapper">
			<h2 className="my-5 stdBlockTitleWhite" dangerouslySetInnerHTML={ { __html:props.blockTitle}} exact></h2>
	    </div>
	)
}


export default StdBlockTitleWhite;