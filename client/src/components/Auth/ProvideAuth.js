import React, { useState } from "react";

const ProvideAuth = ({ authContext, children }) => {
    const fakeAuth = {
        isAuthenticated: false,
        signin(cb) {
            fakeAuth.isAuthenticated = true;
            setTimeout(cb, 100); // fake async
        },
        signout(cb) {
            fakeAuth.isAuthenticated = false;
            setTimeout(cb, 100);
        }
    }

    function useProvideAuth() {
        const [user, setUser] = useState(null);

        const signin = (cb, user) => {
            return fakeAuth.signin(() => {
                setUser(user);
                cb();
            });
        };

        const signout = cb => {
            return fakeAuth.signout(() => {
                setUser(null);
                cb();
            });
        };

        return {
            user,
            signin,
            signout
        };
    }

    const auth = useProvideAuth()


    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    )

}
export default ProvideAuth