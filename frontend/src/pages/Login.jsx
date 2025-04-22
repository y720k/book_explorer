import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../contexts/UserContext";
import User from "../models/User";
import { setAuthToken, request } from "../utils/api_helper";

// TODO: add client-side input validation

const Login = () => {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [showAlert, setShowAlert] = useState(true);
	const navigate = useNavigate();
	const {user, setUser} = useUserContext();
	
	const onLogin = async (e) => {
        e.preventDefault();
		setLoading(true);
    	setError(null);
	
        request("POST", "/login", {login: email, password: password})
			.then(
            	(response) => {
                	setAuthToken(response.data.token);
					console.log("Login: ", response)
					if (response.status === 200) {
						navigate("/"); 
						setUser(new User(email, response.data.id, response.data.firstName, response.data.lastName))
					}
            }).catch(
            	(error) => {
                setAuthToken(null);
				console.log("Login failed")
				console.log(error)
				setError(error)
            });
    };

  	return (
		<>	
		{error && showAlert &&
			<div id="alert-2" className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
				<svg className="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
					<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
				</svg>
				<span className="sr-only">Info</span>
			<div className="ms-3 text-sm font-medium">
				Wrong username or password.
			</div>
				<button type="button" onClick={() => setShowAlert(false)} className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-2" aria-label="Close">
					<span className="sr-only">Close</span>
					<svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
						<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
					</svg>
				</button>
			</div>
		}

		<h1>
			<span className="italic">Find</span> and <span className="italic">Save</span> Interesting
			<span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text italic"> Books</span>
		</h1>

		<h2>Log in to your account</h2>
		<p className="text-gray-500 mb-4">Please enter your details</p>

		<form onSubmit={onLogin} className="max-w-sm mx-auto w-full">
			<div className="mb-4">
				<label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Email</label>
				<input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border text-sm rounded-lg focus:ring-purple-700 focus:border-purple-700 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="john.doe@company.com" required />
			</div> 
			<div className="mb-4">
				<label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
				<input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border text-sm rounded-lg focus:ring-purple-700 focus:border-purple-700 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="•••••••••" required />
			</div> 
			<button type="submit" className="w-full font-medium text-sm text-white bg-gradient-to-br from-purple-900 to-purple-950 hover:from-purple-700 hover:to-purple-950 p-2 rounded-md transition ">Submit</button>	
			<p className="text-center mt-4 text-sm text-gray-400">
        		Don't have an account? <Link to="/registration" className="text-blue-600 hover:underline dark:text-blue-400">Sign up</Link>
      		</p>
		</form>
		</>
	);
}

export default Login