import React from 'react';
import Link from 'next/link';
import theme from "@/theme/theme";

const Cabecalho = ({ dados }: any) => {
  return (
    <div className="pb-0.5">
      <h1 className='text-4xl text-extra-50'>{dados.titulo}</h1>
      <div className='flex text-gray-500'>
        {dados.migalha.map((item:any, index:any) => (
          <React.Fragment key={index}>
            {item.link != null && (
              <Link href={item.link} className="flex items-center mb-4">
                <h6 >{item.nome}</h6>
              </Link>
            )}
            {item.link == null && (
              <h6 className="flex items-center mb-4">
                {item.nome}
              </h6>
            )}
            {index < dados.migalha.length - 1 && <span className='ml-1 mr-1'>{'>'}</span>}
          </React.Fragment>
        ))}
      </div>
      {dados.info && <div className='info-text bg-gray-100 p-4 rounded-md mb-4'>
        <p className='text-gray-600'>
         {dados.info}
        </p>
      </div>}
      
      <hr />
    </div>
  );
};

export default Cabecalho;
