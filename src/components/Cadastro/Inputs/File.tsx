"use client";
import React, {useState} from "react";
import { generica } from "@/utils/api";
import { toast } from 'react-toastify';

interface FileProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  message: string;
  label: string;
  required: boolean;
  disabled: boolean;
  dir: string;
}

export default function File({
  onChange,
  name,
  message,
  label,
  required,
  disabled,
  dir
}: FileProps) {
	const [loading, setLoading] = useState<boolean>(false);
	const [uploadComplete, setUploadComplete] = useState<boolean>(false);
	
	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    	const { name, files } = event.target;

    	if (files?.length === 0) return;
    	
    	setLoading(true);
    	setUploadComplete(false);

    	const formData = new FormData();
    	formData.append('file', files![0]);
    	formData.append('dir', dir);

    	const body = {
      		metodo: 'post',
      		uri: '/upload',
      		data: formData,
      		headers: {
        			'Content-Type': 'multipart/form-data',
      		},
    	};

    try {
      const response = await generica(body);

      if (response.data.errors) {
        toast('Erro. Tente novamente!', { position: 'bottom-left' });
      } else if (response.data.error) {
        toast(response.data.error.message, { position: 'bottom-left' });
      } else {
        console.log('Arquivo enviado:', name, response.data);
        onChange({ target: { name, value: response.data } });
        setUploadComplete(true);
      }
    } catch (error) {
      console.error('Erro ao enviar o arquivo:', error);
      toast('Erro ao enviar o arquivo:', { position: 'bottom-left' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <label htmlFor={name} className="block text-gray-700 uppercase">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="file"
        id={name}
        name={name}
        className="mt-1 p-2 w-full border rounded-md"
        placeholder={message}
        onChange={handleFileChange}
        disabled={disabled}
        required={required}
        accept=".csv"
      />
      {loading && (<div className="ml-2  animate-spin  w-8 h-8 border-4 rounded-full border-t-gray-900 border-gray-500"></div>)}
    </>
  );
}
