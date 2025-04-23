import Layout from "../layout/Layout";
import { db, collection, doc, getDocs, setDoc, deleteDoc, addDoc, updateDoc } from "../../lib/firebase";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { UploadDropzone } from "@/utils/uploadthing";
import "@uploadthing/react/styles.css";
import imageCompression from "browser-image-compression";
import { BsBuilding, BsCheck, BsChevronDoubleLeft, BsChevronDoubleRight, BsChevronLeft, BsChevronRight, BsCloudUpload, BsController, BsFillTrashFill, BsGrid, BsHouseDoor, BsImage, BsLink45Deg, BsPencil, BsPlusCircleDotted, BsSearch, BsXCircle } from "react-icons/bs";
import { FullscreenModal } from "@/components/FullscreenModal";

const Dashboard = ({ }) => {
  const [activeTab, setActiveTab] = useState('files-collection');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const router = useRouter();

  useEffect(() => {
    const isLoggedInDeveloper = document.cookie
      .split('; ')
      .find(row => row.startsWith('isLoggedInDeveloper='))
      ?.split('=')[1] === 'true';

    const email = process.env.NEXT_PUBLIC_EMAILDEV;
    const password = process.env.NEXT_PUBLIC_PASSWORDDEV;

    if (!isLoggedInDeveloper || email !== process.env.NEXT_PUBLIC_EMAILDEV || password !== process.env.NEXT_PUBLIC_PASSWORDDEV) {
      document.cookie = "isLoggedInDeveloper=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      router.push('/');
    }
  }, [router]);

  const [jsonFiles, setJsonFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [messages, setMessages] = useState('');

  const fetchFiles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "json_files"));
      const sortedFiles = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (a.numberField || 0) - (b.numberField || 0) || (a.name || '').localeCompare(b.name || ''));
      setJsonFiles(sortedFiles);
      setFilteredFiles(sortedFiles);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1);
    setFilteredFiles(jsonFiles.filter(file => file.fileName.toLowerCase().includes(query)));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedFile(files);
  };

  const handleToast = (message) => {
    setMessages(message);
    setShowToast(true);
    setFadeOut(false);
    setTimeout(() => setFadeOut(true), 3000);
    setTimeout(() => setShowToast(false), 6000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || selectedFile.length === 0) return;

    setIsUploading(true);
    try {
      const fileDataPromises = Array.from(selectedFile).map((file) =>
        new Promise(async (resolve, reject) => {
          const reader = new FileReader();

          reader.onload = async () => {
            try {
              const base64String = reader.result.split(',')[1];

              const fileData = {
                fileName: file.name,
                fileBase64: base64String,
                uploadedAt: new Date().toISOString(),
                fileSize: file.size,
                contentType: file.type,
              };

              await setDoc(doc(db, "json_files", file.name), fileData);
              resolve();
            } catch (error) {
              reject(error);
            }
          };

          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
      );

      await Promise.all(fileDataPromises);

      handleToast(`${selectedFile.length} JSON file(s) uploaded successfully!`);
      setSelectedFile(null);
      document.querySelector('input[type="file"]').value = '';
      fetchFiles();
      modalRef.current?.close();
    } catch (error) {
      console.error('Upload error:', error);
      handleToast("An error occurred during the file upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const openDialog = (file = null) => {
    setIsEditMode(Boolean(file));
    setCurrentFile(file);
    setSelectedFile(null);
    modalRef.current?.showModal();
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [visiblePageNumbers, setVisiblePageNumbers] = useState([]);
  const itemsPerPage = 15;
  const [buttonsToShow, setButtonsToShow] = useState(5);

  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const currentItems = filteredFiles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const calculateVisiblePages = () => {
      const startPage = Math.max(currentPage - 2, 1);
      const endPage = Math.min(startPage + buttonsToShow - 1, totalPages);
      setVisiblePageNumbers([...Array(endPage - startPage + 1)].map((_, i) => startPage + i));
    };
    calculateVisiblePages();
  }, [currentPage, totalPages, buttonsToShow]);

  useEffect(() => {
    const updateButtonsToShow = () => {
      setButtonsToShow(window.innerWidth >= 1024 ? 25 : 5);
    };
    updateButtonsToShow();
    window.addEventListener('resize', updateButtonsToShow);
    return () => window.removeEventListener('resize', updateButtonsToShow);
  }, []);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handleNextSet = () => setCurrentPage(Math.min(currentPage + buttonsToShow, totalPages));
  const handlePreviousSet = () => setCurrentPage(Math.max(currentPage - buttonsToShow, 1));

  useEffect(() => {
    const fetchData = async () => {
      await fetchFiles();
    };
    fetchData();
  }, []);

  const modalRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMultipleDelete, setIsMultipleDelete] = useState(false);
  const [selectedJSON, setSelectedJSON] = useState([]);
  const modalDeleteRef = useRef(null);

  const openDeleteDialog = (fileId) => {
    if (!fileId) return handleToast("No file selected for deletion.");

    setIsMultipleDelete(false);
    setSelectedJSON([fileId]);
    modalDeleteRef.current?.showModal();
  };

  const handleDelete = async () => {
    if (selectedJSON.length === 0) return handleToast("No files selected for deletion.");

    try {
      setIsDeleting(true);
      await Promise.all(selectedJSON.map(fileId => deleteDoc(doc(db, "json_files", fileId))));
      setSelectedRows(new Set());
      setSelectAll(false);
      setSelectedJSON([]);
      handleToast("File(s) deleted successfully!");
      fetchFiles();
      modalDeleteRef.current?.close();
    } catch (error) {
      console.error("Error deleting files:", error);
      handleToast("An error occurred while deleting files.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMultipleDelete = () => {
    if (selectedRows.size < 2) return handleToast("Please select at least two files for deletion.");

    setIsMultipleDelete(true);
    setSelectedJSON(Array.from(selectedRows));
    modalDeleteRef.current?.showModal();
  };

  const handleSelectAll = ({ target: { checked } }) => {
    setSelectAll(checked);
    setSelectedRows(checked ? new Set(filteredFiles.map(file => file.id)) : new Set());
  };

  const handleSelectRow = ({ target: { checked } }, fileId) => {
    const updatedRows = new Set(selectedRows);
    checked ? updatedRows.add(fileId) : updatedRows.delete(fileId);
    setSelectedRows(updatedRows);
    setSelectAll(updatedRows.size === filteredFiles.length);
  };

  const [games, setGames] = useState([]);
  const [cores, setCores] = useState([]);
  const [title, setTitle] = useState('');
  const [publisher, setPublisher] = useState('');
  const [gameLink, setGameLink] = useState('');
  const [iframeLink, setIframeLink] = useState('');
  const [core, setCore] = useState('');
  const [description, setDescription] = useState('');
  const [isEditGameMode, setIsEditGameMode] = useState(false);
  const [currentGameId, setCurrentGameId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cover, setCover] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/cores', {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_API_TOKEN,
          },
        });
        const coresData = await res.json();
        setCores(coresData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchGames = async () => {
    try {
      const gamesSnapshot = await getDocs(collection(db, "games"));
      const gamesList = gamesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sortedGames = gamesList.sort((a, b) => {
        if (a.gameNumber !== undefined && b.gameNumber !== undefined) {
          return a.gameNumber - b.gameNumber;
        }

        return a.title.localeCompare(b.title);
      });

      setGames(sortedGames);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleFileReplace = async (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 1024 * 1024) {
        try {
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 800,
          });

          const reader = new FileReader();
          reader.onloadend = () => {
            setCover(reader.result);
          };
          reader.readAsDataURL(compressedFile);
        } catch (error) {
          console.error("Error compressing image: ", error);
        }
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCover(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const createGame = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      const gameData = {
        title,
        publisher,
        gameLink,
        iframeLink,
        core,
        description,
        cover
      };

      const newGameRef = await addDoc(collection(db, "games"), gameData);
      console.log("Game created with ID: ", newGameRef.id);

      setTitle('');
      setPublisher('');
      setGameLink('');
      setIframeLink('');
      setCore('');
      setDescription('');
      setCover(null);

      document.getElementById("add-update_games").close();
      fetchGames();
      handleToast("Game successfully created!");
    } catch (error) {
      console.error("Error adding document: ", error);
      handleToast("Failed to create game. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateGame = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      const gameRef = doc(db, "games", currentGameId);
      const gameData = {
        title,
        publisher,
        gameLink,
        iframeLink,
        core,
        description,
        cover
      };

      await updateDoc(gameRef, gameData);
      console.log("Game updated with ID: ", currentGameId);

      setTitle('');
      setPublisher('');
      setGameLink('');
      setIframeLink('');
      setCore('');
      setDescription('');
      setCover(null);

      document.getElementById("add-update_games").close();
      fetchGames();
      handleToast("Game successfully updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
      handleToast("Failed to update game. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const editGame = (game) => {
    setIsEditGameMode(true);
    setCurrentGameId(game.id);
    setTitle(game.title);
    setPublisher(game.publisher);
    setGameLink(game.gameLink);
    setIframeLink(game.iframeLink);
    setCore(game.core);
    setDescription(game.description);
    setCover(game.cover);
    document.getElementById("add-update_games").showModal();
  };

  const handleFormSubmit = (event) => {
    if (isEditGameMode) {
      updateGame(event);
    } else {
      createGame(event);
    }
  };

  const [selectedGames, setSelectedGames] = useState(new Set());
  const [isDeletingGames, setIsDeletingGames] = useState(false);
  const [isMultipleDeleteGames, setIsMultipleDeleteGames] = useState(false);
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState(true);

  const handleDeleteGame = async (gameId) => {
    console.log('gameId to delete:', gameId);
    setIsDeletingGames(true);
    try {
      await deleteDoc(doc(db, "games", gameId));
      fetchGames();
      handleToast("Game deleted successfully!");
      document.getElementById("delete_confirm2").close();
    } catch (error) {
      console.error("Error deleting game:", error);
      handleToast("Failed to delete game.");
    } finally {
      setIsDeletingGames(false);
    }
  };

  const handleDeleteSelectedGames = async () => {
    setIsDeletingGames(true);
    try {
      await Promise.all(
        Array.from(selectedGames).map((gameId) =>
          deleteDoc(doc(db, "games", gameId))
        )
      );
      setSelectedGames(new Set());
      fetchGames();
      handleToast("Selected games deleted successfully!");
      document.getElementById("delete_confirm2").close();
    } catch (error) {
      console.error("Error deleting selected games:", error);
      handleToast("Failed to delete selected games.");
    } finally {
      setIsDeletingGames(false);
    }
  };

  const handleSelectChange = ({ target: { checked } }) => {
    const allGameIds = games.map(game => game.id);
    setSelectedGames(checked ? new Set(allGameIds) : new Set());
    setIsDeleteButtonDisabled(checked && allGameIds.length < 2);
  };

  const toggleSelectGame = (gameId) => {
    setSelectedGames((prev) => {
      const updated = new Set(prev);
      updated.has(gameId) ? updated.delete(gameId) : updated.add(gameId);
      setIsDeleteButtonDisabled(updated.size < 2);
      return updated;
    });
  };

  const openDeleteConfirmDialog = (gameId) => {
    setCurrentGameId(gameId);
    setIsMultipleDeleteGames(selectedGames.size > 1);
    document.getElementById("delete_confirm2").showModal();
  };

  const [searchQueryGame, setSearchGameQuery] = useState('');
  const [currentPages, setCurrentPages] = useState(1);

  const ITEMS_PER_PAGE = 15;

  const handleSearchGameChange = (event) => {
    setSearchGameQuery(event.target.value);
    setCurrentPages(1);
  };

  const filteredGames = useMemo(() => games.filter((game) =>
    game.title.toLowerCase().includes(searchQueryGame.toLowerCase())
  ), [games, searchQueryGame]);

  const totalPage = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);
  const startIndex = (currentPages - 1) * ITEMS_PER_PAGE;
  const paginatedGames = filteredGames.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const startPage = Math.floor((currentPages - 1) / buttonsToShow) * buttonsToShow + 1;
    return Array.from({ length: Math.min(startPage + buttonsToShow - 1, totalPage) - startPage + 1 }, (_, i) => startPage + i);
  };

  const isNoResults = filteredGames.length === 0;

  useEffect(() => {
    const handleResize = () => setButtonsToShow(window.innerWidth >= 1024 ? 25 : 5);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [files, setFiles] = useState([]);
  const [copiedFileKey, setCopiedFileKey] = useState(null);

  const fetchStorageFiles = async () => {
    const response = await fetch('/api/upload-thing/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify({}),
    });
    if (response.ok) setFiles((await response.json()).files);
    else console.error('Failed to fetch files');
  };

  useEffect(() => { fetchStorageFiles(); }, []);

  const formatFileSize = (sizeInBytes) => {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    let size = sizeInBytes, unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const handleCopyLink = (fileUrl, fileKey) => {
    navigator.clipboard.writeText(fileUrl).then(() => {
      setCopiedFileKey(fileKey);
      setTimeout(() => setCopiedFileKey(null), 3000);
    });
  };

  const sortedFiles = files.sort((a, b) => {
    const aIsNumeric = /^\d/.test(a.name);
    const bIsNumeric = /^\d/.test(b.name);

    if (aIsNumeric && bIsNumeric) {
      const aNum = parseInt(a.name.replace(/\D/g, ""), 10);
      const bNum = parseInt(b.name.replace(/\D/g, ""), 10);
      return aNum - bNum;
    }

    if (aIsNumeric) return -1;
    if (bIsNumeric) return 1;

    return a.name.localeCompare(b.name);
  });

  const [newFileName, setNewFileName] = useState("");
  const [selectedFileKey, setSelectedFileKey] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  const handleRenameModalOpen = (file) => {
    setSelectedFileKey(file.key);
    setNewFileName(file.name);
    document.getElementById('update-files').showModal();
  };

  const handleFileRename = async () => {
    if (!newFileName.trim()) return handleToast("Please enter a new name.");

    setIsRenaming(true);

    try {
      const response = await fetch('/api/upload-thing/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
        body: JSON.stringify({ newName: newFileName, fileKey: selectedFileKey }),
      });

      const result = await response.json();

      response.ok ? handleToast("File renamed successfully!") : handleToast("Failed to rename file.");
      if (response.ok) fetchStorageFiles();
      document.getElementById('update-files').close();
    } catch (error) {
      console.error("Error renaming file:", error);
      handleToast("Error renaming file.");
    } finally {
      setIsRenaming(false);
    }
  };

  const [chosenFiles, setChosenFiles] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isDeletingFiles, setIsDeletingFiles] = useState(false);

  const toggleSelectAll = () => {
    setChosenFiles(isAllSelected ? [] : renderedData.map(f => f.key));
    setIsAllSelected(!isAllSelected);
  };

  const toggleSelectFile = key => setChosenFiles(prev =>
    prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
  );

  const openDeleteModal = key => {
    if (key) setChosenFiles([key]);
    document.getElementById('delete_confirm3').showModal();
  };

  const handleDeleteFiles = async () => {
    try {
      setIsDeletingFiles(true);
      const { success } = await fetch('/api/upload-thing/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileKeys: chosenFiles }),
      }).then(r => r.json());

      handleToast(success
        ? `${chosenFiles.length} file(s) deleted.`
        : 'Failed to delete file(s).'
      );

      if (success) {
        fetchStorageFiles();
        const dialog = document.getElementById('delete_confirm3');
        dialog.close();
      }
    } catch (e) {
      console.error('Error deleting files:', e);
      handleToast('Failed to delete file(s).');
    } finally {
      setIsDeletingFiles(false);
    }
  };

  const [queryString, setQueryString] = useState('');
  const [renderedData, setRenderedData] = useState(files);
  const [activePgNum, setActivePgNum] = useState(1);
  const [paginateButtonCount, setPaginateButtonCount] = useState(5);

  useEffect(() => {
    const handleWindowResize = () => {
      setPaginateButtonCount(window.innerWidth >= 1024 ? 25 : 5);
    };
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  const handleQueryUpdate = ({ target: { value } }) => {
    setQueryString(value);
    setActivePgNum(1);
    setRenderedData(files.filter((file) =>
      file.name.toLowerCase().includes(value.toLowerCase())
    ));
  };

  useEffect(() => {
    setRenderedData(files);
  }, [files]);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(renderedData.length / ITEMS_PER_PAGE);
    const startIdx = (activePgNum - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;

    let startPage = Math.max(1, activePgNum - Math.floor(paginateButtonCount / 2));
    let endPage = startPage + paginateButtonCount - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - paginateButtonCount + 1);
    }

    const visiblePages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    return {
      totalPages,
      currentData: renderedData.slice(startIdx, endIdx),
      visiblePages,
      isFirstPage: activePgNum === 1,
      isLastPage: activePgNum === totalPages,
      isEmpty: renderedData.length === 0
    };
  }, [renderedData, activePgNum, paginateButtonCount]);

  const jumpToFirstPage = () => setActivePgNum(1);
  const jumpToLastPage = () => setActivePgNum(paginationData.totalPages);
  const goToPrevPage = () => setActivePgNum(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setActivePgNum(prev =>
    Math.min(paginationData.totalPages, prev + 1)
  );
  const jumpToPage = (pageNum) => setActivePgNum(pageNum);

  return (
    <Layout>
      <dialog id="delete_confirm3" className="modal">
        <div className="modal-box rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-red-600">
          <form method="dialog">
            <button className="btn text-black btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-black text-lg">DELETE FILES</h3>
          <p className="py-4 text-black">
            {chosenFiles.length > 1
              ? `Are you sure you want to delete ${chosenFiles.length} selected Files?`
              : "Are you sure you want to delete this File?"}
          </p>
          <div className="modal-action">
            <button
              className="btn bg-blue-500 text-black hover:bg-yellow-400 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:border-black rounded btn-sm"
              onClick={handleDeleteFiles}
              disabled={isDeletingFiles}
            >
              {isDeletingFiles ? <span className="loading loading-spinner loading-xs"></span> : "SUBMIT"}
            </button>
          </div>
        </div>
      </dialog>
      <dialog id="update-files" className="modal">
        <div className="modal-box rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-yellow-400">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-black"
              onClick={() => document.getElementById('update-files').close()}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4 text-black">UPDATE FILES</h3>
          <div className="join w-full">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="input input-bordered w-full join-item border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              placeholder="Rename Files ..."
            />
            <button
              type="button"
              onClick={handleFileRename}
              className="btn join-item rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black bg-blue-500 hover:border-black hover:bg-red-600"
            >
              {isRenaming ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <BsCloudUpload />
              )}
            </button>
          </div>
        </div>
      </dialog>
      <dialog id="create-files" className="modal">
        <div className="modal-box rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-yellow-400">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-black"
              onClick={() => document.getElementById('create-files')?.close()}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4 text-black">ADD FILES</h3>
          <UploadDropzone
            className="bg-white ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
            endpoint="fileUploader"
            onClientUploadComplete={(res) => {
              console.log("Files: ", res);
              handleToast("Upload Completed !");

              const dialog = document.getElementById('create-files');
              if (dialog) dialog.close();

              fetchStorageFiles();
            }}
            onUploadError={(error) => {
              handleToast(`ERROR! ${error.message}`);
            }}
          />
        </div>
      </dialog>
      <FullscreenModal title={isEditGameMode ? "UPDATE GAME" : "ADD GAME"} id="add-update_games">
        <form onSubmit={handleFormSubmit} className="mt-4">
          <label className="input input-sm text-xs input-bordered flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black mb-4 bg-base-300">
            <BsController />
            <input
              type="text"
              className="grow"
              placeholder="Title Game ..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label className="input input-sm text-xs input-bordered flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black mb-4 bg-base-300">
            <BsBuilding />
            <input
              type="text"
              className="grow"
              placeholder="Publisher/Developer ..."
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              required
            />
          </label>
          <label className="form-control w-full mb-4">
            <div className="label">
              <span className="label-text text-black">COVER</span>
              <span className="label-text-alt text-black">IMAGE</span>
            </div>
            <input
              type="file"
              className="file-input file-input-bordered w-full join-item file-input-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-base-300"
              accept="image/*"
              onChange={handleFileReplace}
            />
          </label>
          <div className="join w-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black mb-4">
            <input
              className="input input-bordered w-full join-item input-sm text-xs border-r-2 border-black bg-base-300"
              placeholder="Games Link (ZIP) ..."
              value={gameLink}
              onChange={(e) => setGameLink(e.target.value)}
              required
            />
            <input
              className="input input-bordered w-full join-item input-sm text-xs border-l-2 border-black bg-base-300"
              placeholder="Iframe Gameplay/Trailer/Cutscene Games ..."
              value={iframeLink}
              onChange={(e) => setIframeLink(e.target.value)}
              required
            />
            <select
              className="select uppercase select-bordered join-item select-sm border-black bg-base-300 w-full"
              value={core}
              onChange={(e) => setCore(e.target.value)}
              required
            >
              <option value="" disabled>CORES</option>
              {cores.map((coreData, index) => (
                <option key={index} value={coreData.system}>
                  {coreData.core} - {coreData.system}
                </option>
              ))}
            </select>
          </div>
          <textarea
            className="bg-base-300 textarea-xs textarea textarea-bordered w-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black mb-4"
            placeholder="Description ..."
            rows={20}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          <button
            className="bg-blue-500 border-2 border-black text-black hover:border-black hover:bg-red-600 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] w-full btn"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              'SUBMIT'
            )}
          </button>
        </form>
      </FullscreenModal>
      <dialog id="delete_confirm2" className="modal">
        <div className="modal-box rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-red-600">
          <form method="dialog">
            <button className="btn text-black btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-black text-lg">DELETE GAMES</h3>
          <p className="py-4 text-black">
            {isMultipleDeleteGames
              ? `Are you sure you want to delete ${selectedGames.size} selected Games?`
              : "Are you sure you want to delete this Game?"}
          </p>
          <div className="modal-action">
            <button
              className="btn bg-blue-500 text-black hover:bg-yellow-400 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:border-black rounded btn-sm"
              onClick={isMultipleDeleteGames ? handleDeleteSelectedGames : () => handleDeleteGame(currentGameId)}
              disabled={isDeletingGames}
            >
              {isDeletingGames ? <span className="loading loading-spinner loading-xs"></span> : "SUBMIT"}
            </button>
          </div>
        </div>
      </dialog>
      <dialog id="img_convert" className="modal">
        <div className="modal-box rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-red-600 w-11/12 max-w-full">
          <form method="dialog">
            <button className="btn text-black btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-black text-lg">IMAGE TOOLS</h3>
          <div className="mockup-browser bg-blue-500 border-black border-2 mt-4">
            <div className="mockup-browser-toolbar">
              <div className="input !bg-yellow-400 !border-2 border-black">https://imgs-tools.vercel.app</div>
            </div>
            <iframe src="https://imgs-tools.vercel.app" className="h-[800px] w-full border-t-4 border-black" style={{ zoom: '0.7' }} />
          </div>
        </div>
      </dialog>
      <dialog ref={modalDeleteRef} id="delete_confirm" className="modal">
        <div className="modal-box rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-red-600">
          <form method="dialog">
            <button
              className="btn text-black btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => modalDeleteRef.current?.close()}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-black text-lg">DELETE JSON</h3>
          <p className="py-4 text-black">
            {isMultipleDelete
              ? `Are you sure you want to delete ${selectedJSON.length} selected JSON?`
              : "Are you sure you want to delete this JSON?"}
          </p>
          <div className="modal-action">
            <button
              className="btn bg-blue-500 text-black hover:bg-yellow-400 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:border-black rounded btn-sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <span className="loading loading-spinner loading-xs"></span> : "SUBMIT"}
            </button>
          </div>
        </div>
      </dialog>
      <dialog id="upload-update_json" className="modal" ref={modalRef}>
        <div className="modal-box rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-yellow-400">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost text-black absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-4 text-black">{isEditMode ? "UPDATE JSON" : "UPLOAD JSON"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="join w-full">
              <input
                type="file"
                accept=".json"
                className="file-input rounded file-input-bordered join-item shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black w-full bg-base-300"
                onChange={handleFileChange}
                multiple
                required
                disabled={isUploading}
              />
              <button
                type="submit"
                disabled={!selectedFile || isUploading}
                className={`btn join-item rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black text-black 
            ${isUploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-yellow-400'} 
            text-black hover:border-black`}
              >
                {isUploading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <BsCloudUpload />
                )}
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <section className="py-8 mt-14">
        <div className="mx-auto px-6">
          <div className="px-4 py-0.5 border-2 border-black bg-yellow-400 rounded text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
            <div className="breadcrumbs text-sm">
              <ul>
                <li>
                  <Link href="/">
                    <BsHouseDoor />&nbsp;
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/dev/dashboard">
                    <BsGrid />&nbsp;
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div role="tablist" className="tabs tabs-boxed shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black p-0 mb-4">
            <a
              role="tab"
              className={`tab !text-black !bg-blue-500 !rounded-none ${activeTab === 'files-collection' ? 'tab-active' : ''}`}
              onClick={() => handleTabChange('files-collection')}
            >
              FILES
            </a>
            <a
              role="tab"
              className={`tab !text-black !bg-yellow-400 !rounded-none ${activeTab === 'games-collection' ? 'tab-active' : ''}`}
              onClick={() => handleTabChange('games-collection')}
            >
              GAMES
            </a>
            <a
              role="tab"
              className={`tab !text-black !bg-red-600 !rounded-none ${activeTab === 'rom-collection' ? 'tab-active' : ''}`}
              onClick={() => handleTabChange('rom-collection')}
            >
              ROM
            </a>
          </div>
          {activeTab === 'files-collection' && (
            <div className="py-3 px-4 bg-blue-500 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-3">
                <label className="input input-bordered flex items-center gap-2 input-sm border-2 border-black bg-base-300 w-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-l rounded-r-none">
                  <input
                    type="text"
                    value={queryString}
                    onChange={handleQueryUpdate}
                    className="grow"
                    placeholder={`Search Files (${renderedData.length}) ...`}
                  />
                  <BsSearch />
                </label>
                <button onClick={() => document.getElementById('img_convert').showModal()}
                  className={`btn btn-sm btn-square text-black bg-base-300 hover:border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black -ml-2 rounded-none`}
                >
                  <BsImage />
                </button>
                <button
                  onClick={() => openDeleteModal()}
                  className={`btn btn-sm btn-square text-black bg-red-600 hover:bg-yellow-400 hover:border-black hover:text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black -ml-2 rounded-none`}
                  disabled={chosenFiles.length < 2}
                >
                  <BsXCircle />
                </button>

                <button onClick={() => document.getElementById('create-files').showModal()}
                  className={`btn btn-sm btn-square text-black bg-yellow-400 hover:bg-red-600 hover:border-black hover:text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black -ml-2 rounded-l-none rounded-r`}
                >
                  <BsPlusCircleDotted />
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
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th className="truncate">NAME</th>
                      <th className="truncate">SIZE</th>
                      <th className="truncate">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="text-black">
                    {paginationData.currentData.length > 0 ? (
                      paginationData.currentData.map((file) => (
                        <tr key={file.id}>
                          <td className="truncate">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-xs bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                              checked={chosenFiles.includes(file.key)}
                              onChange={() => toggleSelectFile(file.key)}
                            />
                          </td>
                          <td className="truncate">{file.name}</td>
                          <td className="truncate">{formatFileSize(file.size)}</td>
                          <td className="truncate space-x-2">
                            <div className="join">
                              <button
                                onClick={() => handleRenameModalOpen(file)}
                                className="btn join-item btn-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs bg-yellow-400 hover:bg-red-600 hover:border-black text-black btn-square"
                              >
                                <BsPencil />
                              </button>
                              <button
                                className="btn join-item btn-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs bg-blue-500 hover:bg-white hover:border-black text-black btn-square"
                                onClick={() => handleCopyLink(file.link, file.key)}
                              >
                                {copiedFileKey === file.key ? <BsCheck /> : <BsLink45Deg />}
                              </button>
                              <button
                                className="btn join-item btn-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs bg-red-600 hover:bg-yellow-400 hover:border-black text-black btn-square"
                                onClick={() => openDeleteModal(file.key)}
                              >
                                <BsFillTrashFill />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4">No files found</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="text-black">
                    <tr>
                      <th className="truncate">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-xs bg-red-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          checked={isAllSelected}
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th className="truncate">NAME</th>
                      <th className="truncate">SIZE</th>
                      <th className="truncate">ACTION</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="join mt-4 flex justify-center gap-2">
                <button
                  onClick={jumpToFirstPage}
                  disabled={paginationData.isEmpty || paginationData.isFirstPage}
                  className="join-item btn btn-xs btn-square bg-red-600 border-2 border-black text-black hover:bg-yellow-400 hover:border-black disabled:opacity-50"
                >
                  <BsChevronDoubleLeft />
                </button>
                <button
                  onClick={goToPrevPage}
                  disabled={paginationData.isEmpty || paginationData.isFirstPage}
                  className="join-item btn btn-xs btn-square bg-yellow-400 border-2 border-black text-black hover:bg-red-600 hover:border-black disabled:opacity-50"
                >
                  <BsChevronLeft />
                </button>
                {paginationData.visiblePages.map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => jumpToPage(pageNum)}
                    disabled={paginationData.isEmpty}
                    className={`join-item btn btn-xs btn-square border-2 border-black
        ${pageNum === activePgNum
                        ? 'btn-active text-black'
                        : 'bg-yellow-400 hover:bg-red-600 text-black'
                      }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  onClick={goToNextPage}
                  disabled={paginationData.isEmpty || paginationData.isLastPage}
                  className="join-item btn btn-xs btn-square bg-yellow-400 border-2 border-black text-black hover:bg-red-600 hover:border-black disabled:opacity-50"
                >
                  <BsChevronRight />
                </button>
                <button
                  onClick={jumpToLastPage}
                  disabled={paginationData.isEmpty || paginationData.isLastPage}
                  className="join-item btn btn-xs btn-square bg-red-600 border-2 border-black text-black hover:bg-yellow-400 hover:border-black disabled:opacity-50"
                >
                  <BsChevronDoubleRight />
                </button>
              </div>
            </div>
          )}
          {activeTab === 'games-collection' && (
            <div className="py-3 px-4 bg-blue-500 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-3">
                <label className="input input-bordered flex items-center gap-2 input-sm border-2 border-black bg-base-300 w-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-l rounded-r-none">
                  <input
                    type="text"
                    className="grow"
                    placeholder={`Search Games (${filteredGames.length}) ...`}
                    value={searchQueryGame}
                    onChange={handleSearchGameChange}
                  />
                  <BsSearch />
                </label>
                <button onClick={() => document.getElementById('img_convert').showModal()}
                  className={`btn btn-sm btn-square text-black bg-base-300 hover:border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black -ml-2 rounded-none`}
                >
                  <BsImage />
                </button>
                <button
                  onClick={openDeleteConfirmDialog}
                  disabled={isDeleteButtonDisabled}
                  className={`btn btn-sm btn-square text-black bg-red-600 hover:bg-yellow-400 hover:border-black hover:text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black -ml-2 rounded-none`}
                >
                  <BsXCircle />
                </button>
                <button
                  onClick={() => {
                    setIsEditGameMode(false);
                    setTitle('');
                    setPublisher('');
                    setGameLink('');
                    setIframeLink('');
                    setCore('');
                    setDescription('');
                    document.getElementById('add-update_games').showModal();
                  }}
                  className={`btn btn-sm btn-square text-black bg-yellow-400 hover:bg-red-600 hover:border-black hover:text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black -ml-2 rounded-l-none rounded-r`}
                >
                  <BsPlusCircleDotted />
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
                          onChange={handleSelectChange}
                          checked={games.length > 0 && selectedGames.size === games.length}
                        />
                      </th>
                      <th className="truncate">TITLE GAMES</th>
                      <th className="truncate">CORES</th>
                      <th className="truncate">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="text-black">
                    {paginatedGames.length > 0 ? (
                      paginatedGames.map((game) => (
                        <tr key={game.id}>
                          <td className="truncate">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-xs bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                              checked={selectedGames.has(game.id)}
                              onChange={() => toggleSelectGame(game.id)}
                            />
                          </td>
                          <td className="truncate">{game.title}</td>
                          <td className="truncate">{game.core}</td>
                          <td className="truncate space-x-2">
                            <div className="join">
                              <button
                                onClick={() => editGame(game)}
                                className="btn join-item btn-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs bg-yellow-400 hover:bg-red-600 hover:border-black text-black btn-square"
                              >
                                <BsPencil />
                              </button>
                              <button
                                onClick={() => openDeleteConfirmDialog(game.id)}
                                className="btn join-item btn-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs bg-red-600 hover:bg-yellow-400 hover:border-black text-black btn-square"
                              >
                                <BsFillTrashFill />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-3">
                          No games found.
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
                          onChange={handleSelectChange}
                          checked={games.length > 0 && selectedGames.size === games.length}
                        />
                      </th>
                      <th className="truncate">TITLE GAMES</th>
                      <th className="truncate">CORES</th>
                      <th className="truncate">ACTION</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="join mt-4 flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPages(1)}
                  disabled={currentPages === 1 || isNoResults}
                  className="join-item btn btn-xs btn-square bg-red-600 border-2 border-black text-black hover:bg-yellow-400 hover:border-black disabled:opacity-50"
                >
                  <BsChevronDoubleLeft />
                </button>
                <button
                  onClick={() => setCurrentPages(prev => Math.max(1, prev - 1))}
                  disabled={currentPages === 1 || isNoResults}
                  className="join-item btn btn-xs btn-square bg-yellow-400 border-2 border-black text-black hover:bg-red-600 hover:border-black disabled:opacity-50"
                >
                  <BsChevronLeft />
                </button>
                {getPageNumbers().map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPages(pageNum)}
                    disabled={isNoResults}
                    className={`join-item btn btn-xs btn-square border-2 border-black ${currentPages === pageNum
                      ? 'btn-active text-black'
                      : 'bg-yellow-400 hover:bg-red-600 text-black'
                      }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPages(prev => Math.min(totalPage, prev + 1))}
                  disabled={currentPages === totalPage || isNoResults}
                  className="join-item btn btn-xs btn-square bg-yellow-400 border-2 border-black text-black hover:bg-red-600 hover:border-black disabled:opacity-50"
                >
                  <BsChevronRight />
                </button>
                <button
                  onClick={() => setCurrentPages(totalPage)}
                  disabled={currentPages === totalPage || isNoResults}
                  className="join-item btn btn-xs btn-square bg-red-600 border-2 border-black text-black hover:bg-yellow-400 hover:border-black disabled:opacity-50"
                >
                  <BsChevronDoubleRight />
                </button>
              </div>
            </div>
          )}
          {activeTab === 'rom-collection' && (
            <div className="py-3 px-4 bg-blue-500 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-3">
                <label className="input input-bordered flex items-center gap-2 input-sm border-2 border-black bg-base-300 w-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-r-none rounded-l">
                  <input
                    type="text"
                    className="grow"
                    placeholder={`Search JSON (${filteredFiles.length}) ...`}
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <BsSearch />
                </label>
                <button onClick={() => document.getElementById('img_convert').showModal()}
                  className={`btn btn-sm btn-square text-black bg-base-300 hover:border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black -ml-2 rounded-none`}
                >
                  <BsImage />
                </button>
                <button
                  className={`btn btn-sm btn-square text-black bg-red-600 hover:bg-yellow-400 hover:border-black hover:text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black -ml-2 rounded-none`}
                  onClick={handleMultipleDelete}
                  disabled={selectedRows.size < 2}
                >
                  <BsXCircle />
                </button>
                <button
                  onClick={() => openDialog()}
                  className="btn btn-sm btn-square text-black bg-yellow-400 hover:bg-red-600 hover:border-black hover:text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black -ml-2 rounded-l-none rounded-r"
                >
                  <BsPlusCircleDotted />
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
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="truncate">JSON</th>
                      <th className="truncate">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="text-black">
                    {currentItems.length > 0 ? (
                      currentItems.map((file) => (
                        <tr key={file.id}>
                          <td className="truncate">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-xs bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                              checked={selectedRows.has(file.id)}
                              onChange={(e) => handleSelectRow(e, file.id)}
                            />
                          </td>
                          <td className="truncate">{file.fileName}</td>
                          <td className="truncate space-x-2">
                            <div className="join">
                              <button
                                onClick={() => openDialog(file)}
                                className="btn join-item btn-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs bg-yellow-400 hover:bg-red-600 hover:border-black text-black btn-square"
                              >
                                <BsPencil />
                              </button>
                              <button
                                className="btn join-item btn-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs bg-red-600 hover:bg-yellow-400 hover:border-black text-black btn-square"
                                onClick={() => openDeleteDialog(file.id)}
                              >
                                <BsFillTrashFill />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-4">
                          No JSON files found.
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
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="truncate">JSON</th>
                      <th className="truncate">ACTION</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="join mt-4 flex justify-center gap-2">
                <button
                  onClick={handleFirstPage}
                  disabled={currentPage === 1 || searchQuery !== ''}
                  className="join-item btn btn-xs btn-square bg-red-600 border-2 border-black text-black hover:bg-yellow-400 hover:border-black"
                >
                  <BsChevronDoubleLeft />
                </button>
                <button
                  onClick={handlePreviousSet}
                  disabled={currentPage === 1 || searchQuery !== ''}
                  className="join-item btn btn-xs btn-square bg-yellow-400 border-2 border-black text-black hover:bg-red-600 hover:border-black"
                >
                  <BsChevronLeft />
                </button>

                {visiblePageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={searchQuery !== ''}
                    className={`join-item btn btn-xs btn-square border-2 text-black border-black ${currentPage === pageNumber
                      ? 'btn-active text-black'
                      : 'bg-yellow-400 hover:bg-red-600 text-black'
                      }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  onClick={handleNextSet}
                  disabled={currentPage === totalPages || searchQuery !== ''}
                  className="join-item btn btn-xs btn-square bg-yellow-400 border-2 border-black text-black hover:bg-red-600 hover:border-black"
                >
                  <BsChevronRight />
                </button>
                <button
                  onClick={handleLastPage}
                  disabled={currentPage === totalPages || searchQuery !== ''}
                  className="join-item btn btn-xs btn-square bg-red-600 border-2 border-black text-black hover:bg-yellow-400 hover:border-black"
                >
                  <BsChevronDoubleRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      {showToast && (
        <div className={`toast toast-center  ${fadeOut ? 'fade-out' : ''}`}>
          <div className="alert border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-yellow-400 rounded text-black">
            <span>{messages}</span>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Dashboard;

export async function getServerSideProps(context) {
  const cookies = context.req.headers.cookie || "";
  const isLoggedInDeveloper = cookies.includes("isLoggedInDeveloper=true");

  if (isLoggedInDeveloper) {
    const emailCookie = cookies.split(';').find(cookie => cookie.trim().startsWith('email='));
    const email = emailCookie ? emailCookie.split('=')[1] : null;

    if (email !== process.env.NEXT_PUBLIC_EMAILDEV) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    console.log("User is logged in as a Developer.");

    return { props: {} };
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}