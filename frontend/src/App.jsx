import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Favorites from './pages/Favorites'
import ReadingLists from './pages/ReadingLists'
import Login from './pages/Login'
import Registration from './pages/Registration'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { ReadingListProvider } from './contexts/ReadingListsContext'
import { BookProvider } from './contexts/BookContext'
import { UserProvider } from './contexts/UserContext'
import { useModalContext } from './contexts/ModalContext'
import GlobalModal from './components/GlobalModal'


const App = () => {
	
	const {isModalOpen} = useModalContext();

	return (
		<UserProvider>
			<FavoritesProvider>
				<ReadingListProvider>
					<BookProvider>
						<div className='wrapper'>
							<Routes>
								<Route path='/' element={<Home />}></Route>
								<Route path='/favorites' element={<Favorites />}></Route>
								<Route path='/reading_lists' element={<ReadingLists />}></Route>
								<Route path='/login' element={<Login />}></Route>
								<Route path='/registration' element={<Registration />}></Route>
							</Routes>
							{isModalOpen && <GlobalModal />}
						</div>
					</BookProvider>	
				</ReadingListProvider>
			</FavoritesProvider>
		</UserProvider>
  )
}

export default App