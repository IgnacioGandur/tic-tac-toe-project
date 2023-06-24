const displayController = (() => 
{
    const renderMessage = (message) =>
    {
        document.querySelector('#message').innerHTML = message;
    }

    return {
        renderMessage
    }
})();

const Gameboard = (()=>
{
    let gameboard = [];
    
    for(let i=0; i<9; i++)
    {
        gameboard.push('');
    }

    const render = () =>
    {
        let boardHTML = '';
        gameboard.forEach((square, index) => 
        {
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`;
        })
        document.querySelector('#gameboard').innerHTML = boardHTML;
        const squares = document.querySelectorAll('.square');
        squares.forEach((item) => {
            item.addEventListener('click', Game.handleClick);
        });
    }
    
    const update = (index,value) =>
    {
        gameboard[index] = value;
        render();
    }

    const getGameboard = () => 
    {
        return gameboard;
    }
    
    return {
        render,
        update,
        getGameboard
    }
})();

const Game = (()=>
{
    let players = [];
    let currentPlayerIndex;
    let gameOver;
    
    const createPlayers = (name,marker) =>
    {
        return {name,marker}
    }
    
    const start = () => 
    {
        players = 
        [
            createPlayers(document.querySelector('#player1').value, 'X'),
            createPlayers(document.querySelector('#player2').value, 'O'),
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
    }
    const restart = () => 
    {
        for (let i=0; i<9; i++)
        {
            Gameboard.update(i,"");
        }
        Gameboard.render();
        gameOver = false;
        document.querySelector('#message').innerHTML = '';
    }

    const handleClick = (e) =>
    {
       if (gameOver)
        {
            return;
        }
        let index = parseInt(e.target.id.split("-")[1]);
        if (Gameboard.getGameboard()[index] !== '')
        {
            return;
        }
        Gameboard.update(index, players[currentPlayerIndex].marker);
        if (checkForWinner(Gameboard.getGameboard(),players[currentPlayerIndex].marker))
        {
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex].name} wins!`);
        }
        else if (checkForTie(Gameboard.getGameboard()))
        {
            gameOver = true;
            displayController.renderMessage(`It's a tie!`);
        }
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    function checkForWinner (board)
    {
        const winningCombinations = 
        [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6],
        ]
        for (let i = 0; i<winningCombinations.length; i++)
        {
            const [a,b,c] = winningCombinations[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c])
            {
                return true;
            }
        }
        return false;
    }

    function checkForTie(board)
    {
        return board.every(cell => cell !== '');
    }


return {
    start,
    restart,
    handleClick
}
    
})();

const startButton = document.querySelector('#start-button');
const restartButton = document.querySelector('#restart-button').addEventListener('click', ()=>{Game.restart()});
startButton.addEventListener('click', ()=>{
    if (document.querySelector('#player1').value === '' || document.querySelector('#player2').value === '')
    {
        alert('You have to enter the names of both players first.')
         return;
    }

    Game.start();
    document.querySelector('.game-container').style.display = 'flex';
    document.querySelector('.welcome-screen').style.display = 'none';
})