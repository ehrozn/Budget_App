document.addEventListener('DOMContentLoaded', (event) => {
    const table = document.getElementById('sudoku-table');

    document.getElementById('check-button').addEventListener('click', () => {
        let isValid = checkSudoku();
        document.getElementById('result').innerText = isValid ? "Sudoku is correct!" : "Sudoku is incorrect.";
    });

    function generateSudoku(size) {
        table.innerHTML = ''; // Очистка таблицы

        const sudoku = generateSudokuData(size);

        for (let row = 0; row < size; row++) {
            let tr = document.createElement('tr');
            for (let col = 0; col < size; col++) {
                let td = document.createElement('td');
                let input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                if (sudoku[row][col] !== '') {
                    input.value = sudoku[row][col];
                    input.disabled = true;
                }
                td.appendChild(input);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    }

    function generateSudokuData(size) {
        if (size === 4) {
            return [
                [1, '', '', 4],
                ['', 2, 3, ''],
                ['', 3, 2, ''],
                [4, '', '', 1]
            ];
        } else if (size === 6) {
            return [
                [5, 3, '', '', 7, ''],
                [6, '', '', 1, 9, 5],
                ['', 9, 8, '', '', ''],
                [8, '', '', '', 6, ''],
                [4, '', '', 8, '', 3],
                [7, '', '', '', 2, '']
            ];
        } else {
            return [
                [5, 3, '', '', 7, '', '', '', ''],
                [6, '', '', 1, 9, 5, '', '', ''],
                ['', 9, 8, '', '', '', '', 6, ''],
                [8, '', '', '', 6, '', '', '', 3],
                [4, '', '', 8, '', 3, '', '', 1],
                [7, '', '', '', 2, '', '', '', 6],
                ['', 6, '', '', '', '', 2, 8, ''],
                ['', '', '', 4, 1, 9, '', '', 5],
                ['', '', '', '', 8, '', '', 7, 9]
            ];
        }
    }

    function checkSudoku() {
        const inputs = table.getElementsByTagName('input');
        const size = Math.sqrt(inputs.length);
        const values = Array.from(inputs).map(input => input.value || '');

        const rows = Array.from({ length: size }, () => []);
        const cols = Array.from({ length: size }, () => []);
        const squares = Array.from({ length: size }, () => []);

        for (let i = 0; i < size * size; i++) {
            const value = values[i];
            if (value !== '' && (isNaN(value) || value < 1 || value > size)) {
                return false;
            }
            const row = Math.floor(i / size);
            const col = i % size;
            const square = Math.floor(row / Math.sqrt(size)) * Math.sqrt(size) + Math.floor(col / Math.sqrt(size));

            if (value !== '') {
                if (rows[row].includes(value) || cols[col].includes(value) || squares[square].includes(value)) {
                    return false;
                }
                rows[row].push(value);
                cols[col].push(value);
                squares[square].push(value);
            }
        }
        return true;
    }
});

