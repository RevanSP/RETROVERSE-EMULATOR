import { useState, useEffect, useRef } from 'react';
import Layout from "./layout/Layout";
import Link from "next/link";
import Head from 'next/head';

const MemoryPage = () => {
  const [activeTab, setActiveTab] = useState('save-games');
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState({ slot1: null, slot2: null });
  const [savedGames, setSavedGames] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [messages, setMessages] = useState('');
  const dialogRef = useRef(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const savedTitle = localStorage.getItem('gameTitle');
    const savedGamesData = localStorage.getItem('saveGames');
    if (savedTitle) setTitle(savedTitle);
    if (savedGamesData) {
      setSavedGames(JSON.parse(savedGamesData));
    }
  }, []);

  const validateFile = (file) => file && file.name.toLowerCase().endsWith('.srm');

  const handleToast = (message) => {
    setMessages(message);
    setShowToast(true);
    setFadeOut(false);

    setTimeout(() => {
      setFadeOut(true);
    }, 3000);

    setTimeout(() => {
      setShowToast(false);
    }, 6000);
  };

  const handleFileChange = (slot, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!validateFile(file)) {
      handleToast('Only .srm files are allowed');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFiles((prev) => ({ ...prev, [slot]: { name: file.name, data: reader.result } }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const isDuplicateTitle = savedGames.some((game) => game.title === title.trim());
    if (isDuplicateTitle) {
      handleToast('A game with this title already exists.');
      return;
    }

    if (!title.trim()) {
      handleToast('Please enter a title');
      return;
    }

    const newGame = {
      title,
      slotSave: {
        slot1: files.slot1,
        slot2: files.slot2,
      },
    };

    const updatedSavedGames = [...savedGames, newGame];
    localStorage.setItem('saveGames', JSON.stringify(updatedSavedGames));

    handleToast('Files saved successfully!');

    setSavedGames(updatedSavedGames);

    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const handleDownload = (game, slot) => {
    const saveData = game.slotSave[slot];
    if (saveData) {
      const byteString = atob(saveData.data.split(',')[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const byteArray = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) byteArray[i] = byteString.charCodeAt(i);
      const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = saveData.name;
      a.click();
    } else {
      setMessages(`No data available for ${slot}`);
      setShowToast(true);
      setTimeout(() => {
        setFadeOut(true);
      }, 3000);

      setTimeout(() => {
        setShowToast(false);
      }, 6000);
    }
  };

  const [selectedSlots, setSelectedSlots] = useState({});

  const handleSlotChange = (game, slot) => {
    setSelectedSlots((prev) => ({
      ...prev,
      [game.title]: slot,
    }));
  }

  const isSubmitDisabled = !title.trim() || (!files.slot1 && !files.slot2) || savedGames.some((game) => game.title === title.trim());

  const [editingGame, setEditingGame] = useState(null);

  const handleEditClick = (game) => {
    setTitle(game.title);
    setFiles(game.slotSave);
    setEditingGame(game);
    document.getElementById("update_saveGames")?.showModal();
  };

  const handleUpdateGame = () => {
    const updatedGame = { ...editingGame, title: title.trim(), slotSave: files };

    const updatedSavedGames = savedGames.map((game) =>
      game.title === editingGame.title ? updatedGame : game
    );

    localStorage.setItem('saveGames', JSON.stringify(updatedSavedGames));
    setSavedGames(updatedSavedGames);
    document.getElementById("update_saveGames")?.close();

    setMessages("Game updated successfully !");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 6000);
  };

  const isTitleDuplicate = savedGames.some(
    (game) => game.title === title.trim() && game.title !== editingGame?.title
  );

  const isFormChanged =
    title.trim() !== editingGame?.title ||
    files.slot1 !== editingGame?.slotSave.slot1 ||
    files.slot2 !== editingGame?.slotSave.slot2;

  const isSubmitDisabledUpdate = !isFormChanged || isTitleDuplicate || !title.trim();

  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [isMultipleDelete, setIsMultipleDelete] = useState(false);
  const [selectedGames, setSelectedGames] = useState([]);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(true);

  const handleAllCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setIsAllChecked(isChecked);
    const updatedCheckedItems = savedGames.reduce((acc, _, index) => ({ ...acc, [index]: isChecked }), {});
    setCheckedItems(updatedCheckedItems);
    setIsDeleteDisabled(Object.values(updatedCheckedItems).filter(Boolean).length < 2);
  };

  const handleRowCheckboxChange = (e, index) => {
    const isChecked = e.target.checked;
    setCheckedItems(prev => {
      const updatedCheckedItems = { ...prev, [index]: isChecked };
      setIsAllChecked(savedGames.every((_, idx) => updatedCheckedItems[idx]));
      setIsDeleteDisabled(Object.values(updatedCheckedItems).filter(Boolean).length < 2);
      return updatedCheckedItems;
    });
  };

  const handleDeleteClick = (gameTitle) => {
    setIsMultipleDelete(false);
    setSelectedGames([gameTitle]);
    document.getElementById("delete_saveGames")?.showModal();
  };

  const handleDeleteSelectedClick = () => {
    setIsMultipleDelete(true);
    setSelectedGames(Object.keys(checkedItems).filter(key => checkedItems[key]).map(index => savedGames[index].title));
    document.getElementById("delete_saveGames")?.showModal();
  };

  const handleDeleteConfirm = () => {
    if (selectedGames.length === 0) return handleToast('No games selected for deletion.');

    const updatedSavedGames = savedGames.filter(game => !selectedGames.includes(game.title));
    setIsAllChecked(false);
    setCheckedItems({});
    setIsDeleteDisabled(true);
    localStorage.setItem('saveGames', JSON.stringify(updatedSavedGames));
    setSavedGames(updatedSavedGames);
    handleToast(isMultipleDelete ? `Successfully deleted ${selectedGames.length} game(s).` : `Successfully deleted the game titled "${selectedGames[0]}".`);
    document.getElementById("delete_saveGames")?.close();
  };

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredGames = savedGames.filter(game =>
    game.title.toLowerCase().includes(searchTerm)
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [buttonsToShow, setButtonsToShow] = useState(5);
  const itemsPerPage = 15;

  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);

  useEffect(() => {
    const updateButtonsToShow = () => {
      setButtonsToShow(window.innerWidth >= 1024 ? 25 : 5);
    };
    updateButtonsToShow();
    window.addEventListener('resize', updateButtonsToShow);
    return () => window.removeEventListener('resize', updateButtonsToShow);
  }, []);

  const paginateGames = () =>
    filteredGames.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleFirstPage = () => setCurrentPage(1);
  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handleLastPage = () => setCurrentPage(totalPages);

  const displayedPages = Array.from({ length: totalPages }, (_, index) => index + 1)
    .slice(Math.max(currentPage - 1, 0), Math.min(currentPage + buttonsToShow - 1, totalPages));

  const validateStateFile = (file) => file?.name.toLowerCase().endsWith('.state');
  const [gameTitle, setGameTitle] = useState('');
  const [gameFiles, setGameFiles] = useState({ slot1: null, slot2: null });
  const [savedStateGames, setSavedStateGames] = useState([]);
  const [selectedStateSlots, setSelectedStateSlots] = useState({});
  const [hasSlot1File, setHasSlot1File] = useState(false);
  const [hasSlot2File, setHasSlot2File] = useState(false);

  const handleSlotStateChange = (game, slot) => {
    setSelectedStateSlots((prev) => ({ ...prev, [game.title]: slot }));
  };

  const handleStateCreateFileChange = (slot, e) => {
    const file = e.target.files[0];
    if (file && validateStateFile(file)) {
      const reader = new FileReader();
      reader.onload = () => {
        setGameFiles((prev) => ({ ...prev, [slot]: { name: file.name, data: reader.result } }));
        slot === 'slot1' ? setHasSlot1File(true) : setHasSlot2File(true);
      };
      reader.readAsDataURL(file);
    } else {
      handleToast('Only .state files are allowed');
      e.target.value = '';
      slot === 'slot1' ? setHasSlot1File(false) : setHasSlot2File(false);
    }
  };

  const handleStateSubmit = () => {
    if (!gameTitle.trim()) return handleToast('Please enter a title');
    if (savedStateGames.some((game) => game.title === gameTitle.trim())) return handleToast('A game with this title already exists.');

    const newGame = { title: gameTitle, slotSave: gameFiles };
    const updatedSavedStateGames = [...savedStateGames, newGame];
    localStorage.setItem('statesGames', JSON.stringify(updatedSavedStateGames));
    setSavedStateGames(updatedSavedStateGames);
    handleToast('Files saved successfully!');

    const dialog = document.getElementById("add_saveStates");
    dialog?.close();
  };

  useEffect(() => {
    const storedGames = JSON.parse(localStorage.getItem('statesGames')) || [];
    setSavedStateGames(storedGames);
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [editGameTitle, setEditGameTitle] = useState('');
  const [editGameFiles, setEditGameFiles] = useState({ slot1: null, slot2: null });
  const [editIndex, setEditIndex] = useState(null);

  const hasChanges = () => {
    const currentGame = savedStateGames[editIndex];
    return (
      editGameTitle !== currentGame?.title ||
      Object.keys(editGameFiles).some((slot) => editGameFiles[slot]?.data !== currentGame?.slotSave[slot]?.data)
    );
  };

  const handleEdit = (game, index) => {
    setEditGameTitle(game.title);
    setEditGameFiles(game.slotSave);
    setEditIndex(index);
    document.getElementById('update_saveStates')?.showModal();
  };

  const handleUpdateSubmit = () => {
    if (!editGameTitle.trim()) return handleToast('Please enter a title');
    if (savedStateGames.some((game, index) => game.title === editGameTitle.trim() && index !== editIndex)) {
      return handleToast('A game with this title already exists.');
    }

    const updatedGames = [...savedStateGames];
    updatedGames[editIndex] = { title: editGameTitle, slotSave: editGameFiles };

    localStorage.setItem('statesGames', JSON.stringify(updatedGames));
    setSavedStateGames(updatedGames);
    handleToast('Game updated successfully!');
    document.getElementById('update_saveStates')?.close();
    setIsEditing(false);
  };

  const handleStateFileChange = (slot, e) => {
    const file = e.target.files[0];
    if (file && validateStateFile(file)) {
      const reader = new FileReader();
      reader.onload = () => setEditGameFiles((prev) => ({ ...prev, [slot]: { name: file.name, data: reader.result } }));
      reader.readAsDataURL(file);
    } else {
      handleToast('Only .state files are allowed');
      e.target.value = '';
    }
  };

  const handleDelete = (gameTitle) => {
    setSelectedStateGames(new Set([gameTitle]));
    document.getElementById('delete_saveStates')?.showModal();
  };

  const handleDeleteSelected = () => {
    if (selectedStateGames.size < 2) return handleToast('Please select at least 2 games to delete.');
    document.getElementById('delete_saveStates')?.showModal();
  };

  const handleDeleteStateConfirm = () => {
    const updatedSavedStateGames = savedStateGames.filter(game => !selectedStateGames.has(game.title));
    setSavedStateGames(updatedSavedStateGames);
    localStorage.setItem('statesGames', JSON.stringify(updatedSavedStateGames));

    handleToast(`${selectedStateGames.size > 1 ? `${selectedStateGames.size} game(s)` : `Game titled "${[...selectedStateGames][0]}"`} deleted successfully!`);

    setSelectedStateGames(new Set());
    document.getElementById('delete_saveStates')?.close();
  };

  const [selectedStateGames, setSelectedStateGames] = useState(new Set());

  const handleSelectAll = (e) => setSelectedStateGames(e.target.checked ? new Set(savedStateGames.map(game => game.title)) : new Set());

  const handleSelectGame = (gameTitle) => setSelectedStateGames(prev => {
    const newSelectedGames = new Set(prev);
    newSelectedGames.has(gameTitle) ? newSelectedGames.delete(gameTitle) : newSelectedGames.add(gameTitle);
    return newSelectedGames;
  });

  const [searchStateTerm, setSearchStateTerm] = useState('');
  const filteredStatesGames = savedStateGames.filter((game) =>
    game.title.toLowerCase().includes(searchStateTerm.toLowerCase())
  );
  const isAllSelected = savedStateGames.every(game => selectedStateGames.has(game.title)) && savedStateGames.length > 0;

  const handleSearchStatesChange = (e) => setSearchStateTerm(e.target.value);

  const [currentStatesPage, setCurrentStatesPage] = useState(1);

  const totalStatesPages = Math.ceil(filteredStatesGames.length / itemsPerPage);

  useEffect(() => {
    const updateButtonsToShow = () => {
      setButtonsToShow(window.innerWidth >= 1024 ? 25 : 5);
    };
    updateButtonsToShow();
    window.addEventListener('resize', updateButtonsToShow);
    return () => window.removeEventListener('resize', updateButtonsToShow);
  }, []);

  const paginateStateGames = () =>
    filteredStatesGames.slice((currentStatesPage - 1) * itemsPerPage, currentStatesPage * itemsPerPage);

  const handleStatePageChange = (page) => setCurrentStatesPage(page);
  const handleFirstStatePage = () => setCurrentStatesPage(1);
  const handlePreviousStatePage = () => currentStatesPage > 1 && setCurrentStatesPage(currentStatesPage - 1);
  const handleNextStatePage = () => currentStatesPage < totalStatesPages && setCurrentStatesPage(currentStatesPage + 1);
  const handleLastStatePage = () => setCurrentStatesPage(totalStatesPages);

  const displayedStatesPages = Array.from({ length: totalStatesPages }, (_, index) => index + 1)
    .slice(Math.max(currentStatesPage - 1, 0), Math.min(currentStatesPage + buttonsToShow - 1, totalStatesPages));

  return (
    <>
      <Head>
        <title>MEMORY - RETROVERSE</title>
        <meta name="description" content="Manage your emulator's memory settings and game saves with Retroverse. Enjoy seamless retro gaming experiences by optimizing your memory configuration for smoother gameplay." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="RETROVERSE - Memory Settings & Game Saves" />
        <meta property="og:description" content="Optimize memory settings and manage game saves for the best Retroverse gaming experience. Play retro games with smooth performance and full system compatibility." />
        <meta property="og:image" content="https://retroverse-emulator.vercel.app/assets/favicon.png" />
        <meta property="og:url" content="https://retroverse-emulator.vercel.app/memory" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="language" content="en" />
        <meta name="author" content="Rxvxn" />
        <link rel="canonical" href="https://retroverse-emulator.vercel.app/memory" />
      </Head>
      <Layout>
        {showToast && (
          <div className={`toast toast-center mb-24 ${fadeOut ? 'fade-out' : ''}`}>
            <div className="alert border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-yellow-400 rounded text-black">
              <span>{messages}</span>
            </div>
          </div>
        )}
        <dialog id="delete_saveStates" className="modal" ref={dialogRef}>
          <div className="modal-box bg-base-300 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-black">✕</button>
            </form>
            <h3 className="font-bold text-lg mb-5">DELETE SAVE STATES</h3>
            <p className="py-4">
              {selectedStateGames.size > 1
                ? `Are you sure you want to delete the selected ${selectedStateGames.size} game(s)?`
                : `Are you sure you want to delete the game titled "${[...selectedStateGames][0]}"?`}
            </p>
            <div className="modal-action">
              <button
                className="btn btn-sm bg-red-600 hover:bg-yellow-400 border-2 border-black rounded text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:border-black"
                onClick={handleDeleteStateConfirm}
              >
                SUBMIT
              </button>
            </div>
          </div>
        </dialog>
        <dialog id="add_saveStates" className="modal">
          <div className="modal-box bg-base-300 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black ">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-black">✕</button>
            </form>
            <h3 className="font-bold text-lg mb-5">ADD SAVE STATES</h3>
            <label className="input input-bordered flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-base-200 mb-3">
              <i className="bi bi-controller"></i>
              <input
                type="text"
                required
                className="grow"
                placeholder="TITLE GAMES"
                value={gameTitle}
                onChange={(e) => setGameTitle(e.target.value)}
              />
            </label>
            <div className="flex space-x-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">SLOT 1</span>
                </div>
                <input
                  type="file"
                  accept=".state"
                  onChange={(e) => handleStateCreateFileChange('slot1', e)}
                  className="file-input file-input-bordered w-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-base-200"
                />
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">SLOT 2</span>
                </div>
                <input
                  type="file"
                  accept=".state"
                  onChange={(e) => handleStateCreateFileChange('slot2', e)}
                  className="file-input file-input-bordered w-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-base-200"
                />
              </label>
            </div>
            <button
              onClick={handleStateSubmit}
              disabled={!gameTitle.trim() || (!hasSlot1File && !hasSlot2File)}
              className="bg-yellow-400 w-full btn shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black mt-6 hover:bg-red-600 hover:border-black text-black"
            >
              SUBMIT
            </button>
          </div>
        </dialog>
        <dialog id="update_saveStates" className="modal" ref={dialogRef}>
          <div className="modal-box bg-base-300 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-black">✕</button>
            </form>
            <h3 className="font-bold text-lg mb-5">UPDATE SAVE GAMES</h3>
            <label className="input input-bordered flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-base-200 mb-3">
              <i className="bi bi-controller"></i>
              <input
                type="text"
                required
                className="grow"
                placeholder="TITLE GAMES"
                value={editGameTitle}
                onChange={(e) => setEditGameTitle(e.target.value)}
              />
            </label>
            <div className="flex space-x-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">SLOT 1</span>
                </div>
                <input
                  type="file"
                  accept=".state"
                  onChange={(e) => handleStateFileChange('slot1', e)}
                  className="file-input file-input-bordered w-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-base-200"
                  defaultValue=""
                />
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">SLOT 2</span>
                </div>
                <input
                  type="file"
                  accept=".state"
                  onChange={(e) => handleStateFileChange('slot2', e)}
                  className="file-input file-input-bordered w-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-base-200"
                  defaultValue=""
                />
              </label>
            </div>
            <button
              type="button"
              className="bg-yellow-400 w-full btn shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black mt-6 hover:bg-red-600 hover:border-black text-black"
              onClick={handleUpdateSubmit}
              disabled={!hasChanges()}
            >
              SUBMIT
            </button>
          </div>
        </dialog>
        <dialog id="update_saveGames" className="modal" ref={dialogRef}>
          <div className="modal-box bg-base-300 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-black">✕</button>
            </form>
            <h3 className="font-bold text-lg mb-5">UPDATE SAVE GAMES</h3>
            <label className="input input-bordered flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-base-200 mb-3">
              <i className="bi bi-controller"></i>
              <input
                type="text"
                required
                className="grow"
                placeholder="TITLE GAMES"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <div className="flex space-x-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">SLOT 1</span>
                </div>
                <input
                  type="file"
                  accept=".srm"
                  onChange={(e) => handleFileChange('slot1', e)}
                  className="file-input file-input-bordered w-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-base-200"
                  defaultValue=""
                />
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">SLOT 2</span>
                </div>
                <input
                  type="file"
                  accept=".srm"
                  onChange={(e) => handleFileChange('slot2', e)}
                  className="file-input file-input-bordered w-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-base-200"
                  defaultValue=""
                />
              </label>
            </div>
            <button
              disabled={isSubmitDisabledUpdate}
              onClick={handleUpdateGame}
              className="bg-yellow-400 w-full btn shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black mt-6 hover:bg-red-600 hover:border-black text-black"
            >
              SUBMIT
            </button>
          </div>
        </dialog>
        <dialog id="delete_saveGames" className="modal" ref={dialogRef}>
          <div className="modal-box bg-base-300 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-black">✕</button>
            </form>
            <h3 className="font-bold text-lg mb-5">DELETE SAVE GAMES</h3>
            <p className="py-4">
              {isMultipleDelete
                ? `Are you sure you want to delete the selected ${selectedGames.length} game(s)?`
                : `Are you sure you want to delete the game titled "${selectedGames[0]}"?`}
            </p>
            <div className="modal-action">
              <button
                className="btn btn-sm bg-red-600 hover:bg-yellow-400 border-2 border-black rounded text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:border-black"
                onClick={handleDeleteConfirm}
              >
                SUBMIT
              </button>
            </div>
          </div>
        </dialog>
        <dialog id="add_saveGames" className="modal" ref={dialogRef}>
          <div className="modal-box bg-base-300 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-black">✕</button>
            </form>
            <h3 className="font-bold text-lg mb-5">ADD SAVE GAMES</h3>
            <label className="input input-bordered flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-base-200 mb-3">
              <i className="bi bi-controller"></i>
              <input
                type="text"
                required
                className="grow"
                placeholder="TITLE GAMES"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <div className="flex space-x-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">SLOT 1</span>
                </div>
                <input
                  type="file"
                  accept=".srm"
                  onChange={(e) => handleFileChange('slot1', e)}
                  className="file-input file-input-bordered w-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-base-200"
                />
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">SLOT 2</span>
                </div>
                <input
                  type="file"
                  accept=".srm"
                  onChange={(e) => handleFileChange('slot2', e)}
                  className="file-input file-input-bordered w-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-base-200"
                />
              </label>
            </div>
            <button
              disabled={isSubmitDisabled}
              onClick={handleSubmit}
              className="bg-yellow-400 w-full btn shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black mt-6 hover:bg-red-600 hover:border-black text-black"
            >
              SUBMIT
            </button>
          </div>
        </dialog>
        <section className="py-8 mt-14">
          <div className="mx-auto px-6">
            <div className="px-4 py-0.5 border-2 border-black bg-yellow-400 rounded text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
              <div className="breadcrumbs text-sm">
                <ul>
                  <li>
                    <Link href="/">
                      <i className="bi bi-house-door"></i>&nbsp;
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/emulator">
                      <i className="bi bi-sd-card"></i>&nbsp;
                      Memory
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div role="tablist" className="tabs tabs-boxed shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black p-0 mb-4">
              <a
                role="tab"
                className={`tab !text-black !bg-yellow-400 !rounded-none  ${activeTab === 'save-games' ? 'tab-active' : ''}`}
                onClick={() => handleTabChange('save-games')}
              >
                SAVE GAMES
              </a>
              <a
                role="tab"
                className={`tab !text-black !bg-red-600 !rounded-none ${activeTab === 'save-states' ? 'tab-active' : ''}`}
                onClick={() => handleTabChange('save-states')}
              >
                SAVE STATES
              </a>
            </div>
            {activeTab === 'save-games' && (
              <div className="py-3 px-4 bg-blue-500 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 mb-3">
                  <label className="input input-bordered flex items-center gap-2 input-sm border-2 border-black bg-base-300 w-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-l rounded-r-none">
                    <input
                      type="text"
                      className="grow"
                      placeholder={`Search Save Games (${filteredGames.length}) ...`}
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <i className="bi bi-search"></i>
                  </label>
                  <button
                    className={`btn btn-sm btn-square text-black bg-red-600 hover:bg-yellow-400 hover:border-black hover:text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black -ml-2 rounded-none`}
                    onClick={handleDeleteSelectedClick}
                    disabled={isDeleteDisabled}
                  >
                    <i className="bi bi-x-circle"></i>
                  </button>
                  <button
                    onClick={() => {
                      setTitle('');
                      setFiles({ slot1: null, slot2: null });

                      document.getElementById('add_saveGames').showModal();
                    }}
                    className={`btn btn-sm btn-square text-black bg-yellow-400 hover:bg-red-600 hover:border-black hover:text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black -ml-2 rounded-l-none rounded-r`}
                  >
                    <i className="bi bi-plus-circle-dotted"></i>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="table table-xs">
                    <thead className="text-black">
                      <tr>
                        <th className="truncate">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-xs bg-red-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            checked={isAllChecked}
                            onChange={handleAllCheckboxChange}
                          />
                        </th>
                        <th className="truncate">TITLE GAMES</th>
                        <th className="truncate">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="text-black">
                      {paginateGames().length > 0 ? (
                        paginateGames().map((game, index) => (
                          <tr key={index}>
                            <td className="truncate">
                              <input
                                type="checkbox"
                                className="checkbox checkbox-xs bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                checked={checkedItems[index] || false}
                                onChange={(e) => handleRowCheckboxChange(e, index)}
                              />
                            </td>
                            <td className="truncate">{game.title}</td>
                            <td className="truncate space-x-2">
                              <div className="join">
                                <select
                                  className="select select-bordered join-item select-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs bg-yellow-400"
                                  value={selectedSlots[game.title] || ''}
                                  onChange={(e) => handleSlotChange(game, e.target.value)}
                                >
                                  <option value="" disabled>
                                    SELECT SLOT
                                  </option>
                                  <option value="slot1" disabled={!game.slotSave.slot1}>
                                    SLOT 1
                                  </option>
                                  <option value="slot2" disabled={!game.slotSave.slot2}>
                                    SLOT 2
                                  </option>
                                </select>
                                <button
                                  className="btn join-item bg-red-600 btn-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs btn-square hover:bg-yellow-400 hover:border-black text-black"
                                  onClick={() => handleDownload(game, selectedSlots[game.title])}
                                  disabled={!selectedSlots[game.title] || !game.slotSave[selectedSlots[game.title]]}
                                >
                                  <i className="bi bi-download"></i>
                                </button>
                              </div>
                              <div className="join">
                                <button
                                  className="btn join-item btn-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs bg-yellow-400 hover:bg-red-600 hover:border-black text-black btn-square"
                                  onClick={() => handleEditClick(game)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn join-item btn-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs bg-red-600 hover:bg-yellow-400 hover:border-black text-black btn-square"
                                  onClick={() => handleDeleteClick(game.title)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">
                            <span>Data not found.</span>
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="text-black">
                      <tr>
                        <th className="truncate">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-xs bg-red-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            checked={isAllChecked}
                            onChange={handleAllCheckboxChange}
                          />
                        </th>
                        <th className="truncate">TITLE GAMES</th>
                        <th className="truncate">ACTION</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="join mt-4 flex justify-center gap-2">
                  <button
                    className={`join-item btn btn-xs btn-square bg-red-600 border-2 border-black text-black ${paginateGames().length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400 hover:border-black'}`}
                    onClick={handleFirstPage}
                    disabled={paginateGames().length === 0}
                  >
                    <i className="bi bi-chevron-double-left"></i>
                  </button>
                  <button
                    className={`join-item btn btn-xs btn-square bg-yellow-400 border-2 border-black text-black ${paginateGames().length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600 hover:border-black'}`}
                    onClick={handlePreviousPage}
                    disabled={paginateGames().length === 0}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  {displayedPages.map((page) => (
                    <button
                      key={page}
                      className={`join-item btn btn-xs btn-square border-2 border-black ${currentPage === page ? 'btn-active' : 'bg-yellow-400 hover:bg-red-600 hover:border-black'}`}
                      onClick={() => handlePageChange(page)}
                      disabled={paginateGames().length === 0}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className={`join-item btn btn-xs btn-square bg-yellow-400 border-2 border-black text-black ${paginateGames().length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600 hover:border-black'}`}
                    onClick={handleNextPage}
                    disabled={paginateGames().length === 0}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                  <button
                    className={`join-item btn btn-xs btn-square bg-red-600 border-2 border-black text-black ${paginateGames().length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400 hover:border-black'}`}
                    onClick={handleLastPage}
                    disabled={paginateGames().length === 0}
                  >
                    <i className="bi bi-chevron-double-right"></i>
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'save-states' && (
              <div className="py-3 px-4 bg-blue-500 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 mb-3">
                  <label className="input input-bordered flex items-center gap-2 input-sm border-2 border-black bg-base-300 w-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-l rounded-r-none">
                    <input
                      type="text"
                      className="grow"
                      placeholder={`Search Save States (${filteredStatesGames.length}) ...`}
                      value={searchStateTerm}
                      onChange={handleSearchStatesChange}
                    />
                    <i className="bi bi-search"></i>
                  </label>
                  <button
                    className={`btn btn-sm btn-square text-black bg-red-600 hover:bg-yellow-400 hover:border-black hover:text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black -ml-2 rounded-none`}
                    disabled={selectedStateGames.size < 2}
                    onClick={handleDeleteSelected}
                  >
                    <i className="bi bi-x-circle"></i>
                  </button>
                  <button onClick={() => {
                    setGameTitle('');
                    setGameFiles({ slot1: null, slot2: null });
                    document.getElementById('add_saveStates').showModal();
                  }}
                    className={`btn btn-sm btn-square text-black bg-yellow-400 hover:bg-red-600 hover:border-black hover:text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black -ml-2 rounded-l-none rounded-r`}
                  >
                    <i className="bi bi-plus-circle-dotted"></i>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="table table-xs">
                    <thead className="text-black">
                      <tr>
                        <th className="truncate">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-xs bg-red-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th className="truncate">TITLE GAMES</th>
                        <th className="truncate">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="text-black">
                      {paginateStateGames().length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center">Data not found.</td>
                        </tr>
                      ) : (
                        paginateStateGames().map((game, index) => (
                          <tr key={index}>
                            <td className="truncate">
                              <input
                                type="checkbox"
                                className="checkbox checkbox-xs bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                checked={selectedStateGames.has(game.title)}
                                onChange={() => handleSelectGame(game.title)}
                              />
                            </td>
                            <td className="truncate">{game.title}</td>
                            <td className="truncate space-x-2">
                              <div className="join">
                                <select
                                  className="select select-bordered join-item select-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs bg-yellow-400"
                                  value={selectedStateSlots[game.title] || ''}
                                  onChange={(e) => handleSlotStateChange(game, e.target.value)}
                                >
                                  <option value="" disabled>SELECT SLOT</option>
                                  <option value="slot1" disabled={!game.slotSave.slot1}>SLOT 1</option>
                                  <option value="slot2" disabled={!game.slotSave.slot2}>SLOT 2</option>
                                </select>
                                <button
                                  className="btn join-item bg-red-600 btn-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs btn-square hover:bg-yellow-400 hover:border-black text-black"
                                  onClick={() => handleDownload(game, selectedStateSlots[game.title])}
                                  disabled={!selectedStateSlots[game.title] || !game.slotSave[selectedStateSlots[game.title]]}
                                >
                                  <i className="bi bi-download"></i>
                                </button>
                              </div>
                              <div className="join">
                                <button
                                  className="btn join-item btn-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs bg-yellow-400 hover:bg-red-600 hover:border-black text-black btn-square"
                                  onClick={() => handleEdit(game, index)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn join-item bg-red-600 btn-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs btn-square hover:bg-yellow-400 hover:border-black text-black"
                                  onClick={() => handleDelete(game.title)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot className="text-black">
                      <tr>
                        <th className="truncate">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-xs bg-red-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th className="truncate">TITLE GAMES</th>
                        <th className="truncate">ACTION</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="join mt-4 flex justify-center gap-2">
                  <button
                    className={`join-item btn btn-xs btn-square bg-red-600 border-2 border-black text-black ${paginateStateGames().length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400 hover:border-black'}`}
                    onClick={handleFirstStatePage}
                    disabled={paginateStateGames().length === 0}
                  >
                    <i className="bi bi-chevron-double-left"></i>
                  </button>
                  <button
                    className={`join-item btn btn-xs btn-square bg-yellow-400 border-2 border-black text-black ${paginateStateGames().length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600 hover:border-black'}`}
                    onClick={handlePreviousStatePage}
                    disabled={paginateStateGames().length === 0}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  {displayedStatesPages.map((page) => (
                    <button
                      key={page}
                      className={`join-item btn btn-xs btn-square border-2 border-black ${currentStatesPage === page ? 'btn-active' : 'bg-yellow-400 hover:bg-red-600 hover:border-black'}`}
                      onClick={() => handleStatePageChange(page)}
                      disabled={paginateStateGames().length === 0}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className={`join-item btn btn-xs btn-square bg-yellow-400 border-2 border-black text-black ${paginateStateGames().length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600 hover:border-black'}`}
                    onClick={handleNextStatePage}
                    disabled={paginateStateGames().length === 0}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                  <button
                    className={`join-item btn btn-xs btn-square bg-red-600 border-2 border-black text-black ${paginateStateGames().length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400 hover:border-black'}`}
                    onClick={handleLastStatePage}
                    disabled={paginateStateGames().length === 0}
                  >
                    <i className="bi bi-chevron-double-right"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>

  );
};

export default MemoryPage;