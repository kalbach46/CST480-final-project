"""
This is the psudo code for game logic
"""

#### BELOW IS GAME LOGIC
class player:
    def __init__(self, deck, id):
        self.deck = deck
        self.id = id
    
    def getRemain(self):
        return len(self.deck)


class card:
    def __init__(self, atk, hp, owner):
        self.owner = owner
        self.attack = atk
        self.hp = hp
        
    def attack(self, other):
        other.hp -= self.attack
    
# Function to determine end game | and applies the turn
def turn(board, player):
    # board [] -> 3x3 board
    def attackAdj(row, col):
        attacker = board[row][col]
        for r in range(row-1,row+2):# Adj ind , row - 1 -> row +2 if row == 2 -> 1,2,3
            for c in range(col-1,col+2):
                toAttack = board[r][c]
                if (toAttack.owner == player):
                    continue # friendly | includes self
                attacker.attack(board[r][c])
                
    def wipeOut():
        for r in range(len(board)):
            for c in range(len(board[0])):
                curCard = board[r][c]
                if curCard.hp <= 0:
                    board[r][c] = None
    
    for row in range(len(board)):
        for col in range(len(board[0])):
            attacker = board[row][col]
            if (attacker.owner == player):
                attackAdj(row,col)
                
    wipeOut()
                
                
def terminate(player1, player2, board):
    ### RULES
    # 1. If player owns more than 5 places in the board
    # 2. if both player has no card -> check board control : more place in board means win
    
    player1Cards = 0
    player2Cards = 0
    for row in board:
        for card in row:
            if not(card):
                continue
            
            if (card.owner == player1):
                player1Cards += 1
                continue
            if (card.owner == player2):
                player2Cards += 1
    
    if player1Cards > 4:
        return player1.id
    
    if player2Cards > 4:
        return player2.id
    
    # If both has no card
    if player1.getRemain() == 0 and player2.getRemain() == 0:
        if player1Cards == player2Cards:
            return "tied"
        
        elif player1Cards > player2Cards:
            return player1.id
        
        else:
            return player2.id
            
    return None # or void 