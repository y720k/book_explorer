import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import User from "../models/User";
import { setAuthToken, request } from "../utils/api_helper";
import { useUserContext } from "../contexts/UserContext";

// TODO: add client-side input validation

const Registration = () => {

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	
	const navigate = useNavigate();	
	const {user, setUser} = useUserContext();

	const onRegister = async (e) => {

		e.preventDefault();
    	setError(null);

		console.log(email);
		console.log(password);
		console.log(firstName);
		console.log(lastName);
        
        request("POST", "/registration",
            {
                firstName: firstName,
                lastName: lastName,
                login: email,
                password: password
            }).then(
				(response) => {
					setAuthToken(response.data.token);					
					console.log(response)

					if (response.status === 201) { // new resource has been created
						navigate("/login");
						setUser(new User(email, response.data.id, response.data.firstName, response.data.lastName))
					}

            }).catch(
				(error) => {
					setAuthToken(null);
					console.error("Login failed", error)
					setError(error)
            	}
        	);
    };

  return (
	<>
		<h1>
			<span className="italic">Find</span> and <span className="italic">Save</span> Interesting
			<span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text italic"> Books</span>
		</h1>

		<h2>Create a new account</h2>
		<p className="text-gray-500 mb-4">Please enter your details</p>

		<form onSubmit={onRegister} className="max-w-sm mx-auto w-full">
			<div className="mb-4">
				<label htmlFor="firstName" className="block mb-2 text-sm font-medium text-white">First Name</label>
				<input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="border text-sm rounded-lg focus:ring-purple-700 focus:border-purple-700 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="John" required />
			</div>
			<div className="mb-4">
				<label htmlFor="lastName" className="block mb-2 text-sm font-medium text-white">Last Name</label>
				<input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="border text-sm rounded-lg focus:ring-purple-700 focus:border-purple-700 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="Doe" required />
			</div>
			<div className="mb-4">
				<label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Email</label>
				<input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border text-sm rounded-lg focus:ring-purple-700 focus:border-purple-700 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="john.doe@company.com" required />
			</div> 
			<div className="mb-4">
				<label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
				<input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border text-sm rounded-lg focus:ring-purple-700 focus:border-purple-700 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="•••••••••" required />
			</div> 
			
      		{/* TODO: add check if passwords match*/}
			<div className="mb-4">
				<label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-white">Confirm password</label>
				<input type="password" id="confirm_password" className="border text-sm rounded-lg focus:ring-purple-700 focus:border-purple-700 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="•••••••••" required />
			</div> 	

			<button type="submit" className="w-full font-medium text-sm text-white bg-gradient-to-br from-purple-900 to-purple-950 hover:from-purple-700 hover:to-purple-950 p-2 rounded-md transition">Sign Up</button>
			<p className="text-center mt-4 text-sm text-gray-400">
        		Already have an account? <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">Log in.</Link>
      		</p>
		</form>
		
	</>
  );
}

export default Registration