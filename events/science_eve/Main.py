from Moves import *
import os
import json
import sys
import time
import math
def str_list(string):
    string_list = string.strip('[').strip('\n').strip(']').split(',')
    final = [int(i) for i in string_list]
    return final

class error:
      path = ""
      
      file_names = ['pod_pos','trap','exchange','hint']

      class_files = ['move','position','time']

      cops = None 

      spy = None

      def action(error_level):
        path=error.path

        file_names= error.file_names
        
        class_files = error.class_files

        cops = error.cops

        spy = error.spy

        for i in file_names:
            file = open(os.path.join(path,i+'.txt'),'w')
            json.dump(eval('log.'+i),file)
        for i in class_files:
            file = open(os.path.join(path,'Jor-El '+i+'.txt'),'w')
            json.dump(eval('cops.log.'+i),file)
        for i in class_files:
            file = open(os.path.join(path,"Zod's "+i+'.txt'),'w')
            json.dump(eval('spy.log.'+i),file)
        
        print()

        print("RETURN VALUE: ",error_level)

        d=input('\nPress Enter to exit')
        
        sys.exit(error_level)



class log:
    exchange = {}
    
    trap = {}

    pod_pos = {}

    hint = {}

    def __init__(self,iden = None):
        self.move = {} 
        self.position = {}
        self.block = 0
        self.time = {}
    def insert(self,move_made,pos):
        self.move[self.block] = []
        for i in range(len(move_made)):
            self.move[self.block].append(move_made[i])

        self.position[self.block] =[]
        for i in range(len(pos)):
            if pos[i] != -1:
                self.position[self.block].append([])
                for j in pos[i]:
                    self.position[self.block][i].append(j)
            else:
                self.position[self.block].append(-1)

        self.block += 1
    def output(self):
        print(self.block)
        print(self.move)
        print(self.position)
        print(self.trap)
class player:
    def __init__(self,pos,number,iden = None):
        '''
        temp = []
        for i in range(number):
            temp.append(str_list(input()))
        '''
        self.pos = pos
        self.log = log()
        self.imp = iden
        if iden != None:
            log.pod_pos[self.log.block] = self.imp
        else:
            log.hint[self.log.block] = []
        self.log.insert([],pos)

    def validate(self,final,iden = None):
        move_made = []
        desicion = 0
        for index,i in enumerate(self.pos):
            if final[index] != -1 and i != -1:
                for k in range(1,5):
                    j=i[:]
                    if k == 3 or k == 4:
                       k+=1
                    execution(j,k)
                    if j==final[index]:
                       move_made.append(k)
                       break
                    elif k==5:
                        move_made.append(-1)   #The Error Stuff is not yet accomodated
                        desicion = 1
            elif final[index] != -1 and i== -1 and desicion ==0:
                desicion = 4
            elif final[index] == -1 and i != -1 and desicion == 0:
                desicion = 5
            else:
                move_made.append(-1)

        hash_tab={}

        for i in final:
            if i != -1:
                try:
                    hash_tab[tuple(i)] += 1
                except KeyError:
                    hash_tab[tuple(i)] = 1

        for i in hash_tab:
            if hash_tab[i] > 1 and desicion == 0:
                desicion = 2

        if iden != None and iden != self.imp:
            for k in range(1,5):
                j = self.pos[self.imp][:]
                if k == 3 or k == 4:
                   k+=1
                execution(j,k)
                if j==self.pos[iden]:
                   break
                elif k==5 and desicion == 0:   #The Error Stuff is not yet accomodated
                    desicion = 3

        if desicion != 0:
            if iden != None:
                error.action(-(desicion+1))
            else:
                error.action(desicion+1)
        
        if iden == None:
            if desicion == 0:
                for i,j in enumerate(final):
                    self.pos[i] = j[:]
                self.log.insert(move_made,self.pos)
        else:
            if desicion==0:
                if self.imp != iden:
                    log.exchange[self.log.block] = [self.imp,iden]
                    self.imp = iden    

                log.pod_pos[self.log.block] = self.imp

                for i,j in enumerate(final):
                    if j != -1:
                        self.pos[i] = j[:]
                    else:
                        self.pos[i] = j
                self.log.insert(move_made,self.pos)  

    def check(self,self2):
        hash_tab = {}

        desicion = 0

        if self.imp != None:
            one = self2
            two = self
        
        else:
            one = self
            two = self2
            log.pod_pos[self.log.block] = self.imp 

        for i in one.pos:
            try:
                hash_tab[tuple(i)] += 1
            except KeyError:
                hash_tab[tuple(i)] = 1

        for i,j in enumerate(two.pos):
            if j != -1:
                try:
                    if hash_tab[tuple(j)] >= 1:
                        two.pos[i] = -1
                        if self.imp != None:
                            two.log.position[two.log.block-1][i] = -1 
                        log.trap[i] = self.log.block
                except KeyError:
                    hash_tab[tuple(j)] = 1
        
        self2.log.insert([],self2.pos)

        log.pod_pos[two.log.block] = two.imp

    def safe(self):
        if self.imp != None:
            if self.pos[self.imp] != -1:
                return True
            else:
                error.action(1)

def file_input():
    cop_file = input("Enter the location of Jor-El's Source File: ")
    spy_file = input("Enter the location of Zod's Source File: ")

    path,filename=os.path.split(cop_file)
    filename = filename.split('.')[0]

    sys.path.insert(1,path)

    cop_module = __import__(filename)
    
    path2,filename2=os.path.split(spy_file)
    filename2 = filename2.split('.')[0]

    sys.path.insert(1,path2)

    spy_module = __import__(filename2)

    return cop_module,spy_module
    

    return cop_module,cops,spy

def copy(a):
    b = []
    while(len(b) < len(a)):
        b.append([])
    for i,j in enumerate(a):
        b[i] = j[:]
    return b


class timing:

    default = 1

    cop_handle = None

    spy_handle = None 

    temp = None

    def time_limit(string,factor=default):
        default = timing.default

        cop_handle = timing.cop_handle

        spy_handle = timing.spy_handle

        temp = timing.temp

        init = 3
        move = 0.2
        info = 0.1

        t1 = time.perf_counter()

        b=eval(string)

        t2 = time.perf_counter()

        time_limit = (t2-t1)


        function = string.split('.')[1].split('(')[0]



        lim = float(factor*(eval(function)))

        if lim != 0 and (time_limit - lim) > 0.05:
            if string.split('.')[0] == 'cop_handle': 
                error.action(7)
            else:
                error.action(-7)
           

        return b,time_limit


def main():
    number = int(input("Enter the index of Battle Arena you want: "))

    binary = int(input("Do you want any time restrictions? ( 0 if no and 1 if yes ): "))
    timing.default= binary

    path = os.path.join(os.getcwd(),'Configurations','config_'+str(number)+'.txt')

    config = json.load(open(path))

    #config = [[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16],[17,18,19,20]],[[21,22,23,24],[25,26,27,28],[29,30,31,32]]]

    cops = player(config[0],5)
    spy = player(config[1],3,0)
    cop_handle , spy_handle = file_input()

    timing.cop_handle= cop_handle

    timing.spy_handle = spy_handle

    temp = copy(config[0])

    timing.temp = temp
    
    output,_time_=timing.time_limit('cop_handle.init(temp)')

    cops.log.time[cops.log.block-1]=[_time_]

    timing.temp = temp
    
    temp = copy(config[1])

    output,_time_=timing.time_limit('spy_handle.init([temp,0])')

    spy.log.time[cops.log.block-1]=[_time_]
    
    if not os.path.isdir('History'):
        os.mkdir('History')

    bias = 16548

    fac = 64
    
    new_dir=None

    if os.path.isfile('Game_Number.txt'):
        file1 = open('Game_Number.txt','r+')
        output1 = int(file1.readline().strip('\n'))
        game_number = int((output1/fac)-bias)
        game_number+=1
        new_dir = 'Battle #'+str(game_number)
        file1.seek(0)
        file1.write(str((game_number+bias)*fac))
        file1.close()
    else:
        file1 = open('Game_Number.txt','w')
        game_number=1
        new_dir = 'Battle #'+str(game_number)
        file1.write(str((game_number+bias)*fac))
        file1.close()

    new_dir = os.path.join(os.getcwd(),'History',new_dir)

    if not os.path.isdir(new_dir):
        os.mkdir(new_dir)



    error.path = os.path.join(os.getcwd(),new_dir)

    error.cops = cops

    error.spy =spy
    
    control = True

    steps = int(input("How much time is left before the planet dies: (Recommended 500)"))

    while True:
        if steps <=steps:
            if control:
                temp = copy(cops.pos)
                timing.temp = temp
                output,_time_=timing.time_limit('cop_handle.move(temp)',5)
                cops.log.time[int(steps/2)+1]=[_time_]
                cops.validate(output)
                cops.check(spy)
                spy.safe()
                if steps%5:
                    temp = [math.floor(i/3)+ 1 for i in spy.log.move[spy.log.block-2]]
                    timing.temp = temp
                    output,_time_=timing.time_limit('cop_handle.info(1,temp)')
                    cops.log.hint[int(steps/2)+1] = temp[:]
                    cops.log.time[int(steps/2)+1].append(_time_)
                else:
                    temp = copy(spy.pos)
                    timing.temp = temp
                    output,_time_=timing.time_limit('cop_handle.info(0,temp)')
                    cops.log.hint[int(steps/2)+1] = copy(temp)
                    cops.log.time[int(steps/2)+1].append(_time_)
            else:
                temp = [copy(spy.pos),spy.imp]
                timing.temp = temp
                output,_time_=timing.time_limit('spy_handle.move(*temp)',3)
                spy.log.time[int((steps-1)/2)+1]=[_time_]
                spy.validate(*output)
                spy.check(cops)
                spy.safe()
                temp = copy(cops.pos)
                timing.temp = temp
                output,_time_=timing.time_limit('spy_handle.info(0,temp)')
                spy.log.time[int((steps-1)/2)+1].append(_time_)
        else:
            error.action(-1)
            break

        steps += 1
        control^=True

main()