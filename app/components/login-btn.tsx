"use client"

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginBtn() {
    const { data: session } = useSession();

    if(session) {
        return <>
            <p>Logado como {session.user?.email}</p>
            <button onClick={() => signOut()}>Deslogar</button>
        </>
    } else {
        return <>
            <p>Ainda não logado</p>
            <button onClick={() => signIn('google')}>Logar como</button>
        </>
    }
}