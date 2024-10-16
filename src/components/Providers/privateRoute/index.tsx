
import { ReactNode, useEffect, useState } from "react";
import { useMutation } from "react-query";
import api from "@/api/http-common";
import { getStorageItem } from "@/utils/localStore";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants/app-routes";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState} from '@/redux/store';
import { error } from "console";
import { postLogin } from "@/api/auth/postLogin";


interface PrivateRouteProps{
    children: ReactNode;
}

const PrivateRoute = (props: PrivateRouteProps) =>{
    const [authorized, setAuthorized] = useState(false);
    const [token, setToken] = useState(getStorageItem("token"));

    const dispatch = useDispatch();
    const {push} = useRouter()
    
    useEffect(() =>{
        api.defaults.headers.authorization = `Bearer ${token}`;
        if(token != undefined){
            setAuthorized(true);
//            mutate();
        }else{
            push(APP_ROUTES.public.login);
        }

    }, []);

    //validação do token
    //const { status , mutate} = useMutation(
    //    async () =>{
     //       return postLogin(token);
    //       
    //    },{
    //        onSuccess: (res) =>{
    //            setAuthorized(true);
    //        },
    //        onError: (error) =>{

//                console.log(error)
  //          }
    //    }
   // )


    return(
        <>
            {authorized && props.children}
        </>
    )
}

export default PrivateRoute;