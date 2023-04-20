import { useEffect } from "react";
import { AuthContext } from "../utility/auth";
import Backend from "../utility/backend";

const testBackend = async () => {
    console.log("testBackend() called");
    await Backend.createRoom();
}

const joinRoom = async () => {
    console.log("joinRoom() called");
    const response = await Backend.joinRoom("DEADB");
}

const login = async () => {
    const response = await Backend.loginUser({
        username: "test",
        password: "test"
      });
}

const setPiece = async (piece) => {
    let pieceObject = {
        piece: piece
    };
    console.log(JSON.stringify(pieceObject));
    const response = await Backend.setPiece("DEADB", pieceObject, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });
}

const clearPiece = async () => {
    const response = await Backend.clearPiece("DEADB", (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });
}

const startGame = async () => {
    const response = await Backend.startGame("DEADB", (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });
}

// useEffect (() => {
//     console.log("Logging in...");
//     login();
// }, []);

const BackendTesting = () => {
    // function to call set piece with the input from the text field
    const setPieceFromInput = () => {
        console.log("setPieceFromInput() called");
        const piece = document.getElementById("piece").value;
        console.log("Piece: " + piece);
        setPiece(piece);
    }

    return (
        // Submit button to test backend
        <div>
            <h1>Backend Testing Page</h1>
            <h2>Create room test</h2>
            <button onClick={testBackend}>Test room create!</button>

            <h2>Join cool kids room</h2>
            <button onClick={joinRoom}>Test join room!</button>

            <h2>Set current user piece</h2>
            <input type="text" id="piece" name="piece" />
            <button onClick={setPieceFromInput}>Test set piece!</button>

            <h2>Clear current user piece</h2>
            <button onClick={clearPiece}>Test clear piece!</button>

            <h2>Start DEADB game</h2>
            <button onClick={startGame}>Test start game!</button>
        </div>
    );
}

export default BackendTesting;