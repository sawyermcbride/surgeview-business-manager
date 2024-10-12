import React from "react";
import { Spin } from "antd";

const LoadingComponent: React.FC = function() {


  return (
    <div className="global-loading" style={{
        position: 'fixed',
        top: '-40%',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000 
      }}>

      <Spin size="large" />
    
    </div>
  )
}

export default LoadingComponent;