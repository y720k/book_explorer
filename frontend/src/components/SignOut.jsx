import { useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { initFlowbite } from 'flowbite';
import { useNavigate } from 'react-router-dom';


const SignOut = () => {
  
	const {user, setUser} = useUserContext();
	const navigate = useNavigate();

	useEffect(() => {
        initFlowbite();
      }, []);
  
    return (
        <div>
			<button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" class="text-white text-center flex items-center gap-2" type="button">
				{user ? `${user.firstName} ${user.lastName}` : "User"} 
				{/* Avatar */}
				<div className="relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
					<svg
					    className="absolute w-10 h-10 text-gray-400 -left-1"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
							clipRule="evenodd"
						></path>
					</svg>
				</div>
				<svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
					<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
				</svg>
			</button>
			{/* Dropdown content */}
			<div id="dropdown" className="hidden rounded-lg w-42 bg-gray-700">
				<ul className="py-2 text-sm text-white" aria-labelledby="dropdownDefaultButton">
					{user && (
						<>
						<li>
							<div className='px-2 py-2'>
									<div className='font-semibold'>
										{`${user.firstName} ${user.lastName}`}
									</div> 
									<div>
										{user.email}
									</div>
							</div>
						</li>
						<li>
							<div className='px-2 py-2'>
								<hr className="border-gray-400" />
							</div>
						</li>
						</>
					)}						
					<li>
						<button
							onClick={() => navigate("/login")}
							className="flex items-center gap-x-2 px-2 py-2 hover:bg-gray-600"
						>
							<svg className="w-5 h-5 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2" />
							</svg>
							Sign out
						</button>
					</li>
				</ul>
			</div>
		</div>
  )
}

export default SignOut