import React, { useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import MovieSearch from "./MovieSearch";
import MovieDataViewer from "./MovieDataViewer";
import "./App.css";

import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import config from "./amplifyconfiguration.json";

Amplify.configure(config);

const App = ({ signOut, user }) => {
    const [activeTab, setActiveTab] = useState("search");

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="app">
            <div className="header">
                <h1>Hello {user.username}</h1>
                <button className="signout-button" onClick={signOut}>
                    Sign out
                </button>
            </div>
            <div className="tabs">
                <button
                    className={activeTab === "search" ? "active" : ""}
                    onClick={() => handleTabClick("search")}
                >
                    Movie Search
                </button>
                <button
                    className={activeTab === "viewer" ? "active" : ""}
                    onClick={() => handleTabClick("viewer")}
                >
                    Movie Collection
                </button>
            </div>

            <SwitchTransition mode="out-in">
                <CSSTransition
                    key={activeTab}
                    addEndListener={(node, done) => {
                        node.addEventListener("transitionend", done, false);
                    }}
                    classNames="fade"
                >
                    <div className="tab-content">
                        {activeTab === "search" ? (
                            <MovieSearch />
                        ) : (
                            <MovieDataViewer />
                        )}
                    </div>
                </CSSTransition>
            </SwitchTransition>
        </div>
    );
};

export default withAuthenticator(App);
