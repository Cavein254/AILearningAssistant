import React from "react";

const PageHeader = ({ title, subTitle, children }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subTitle && <p className="text-sm text-gray-600">{subTitle}</p>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};

export default PageHeader;
