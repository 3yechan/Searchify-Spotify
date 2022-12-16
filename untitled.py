#Self Dividing Number
#A self-dividing number is a number that is divisible by every digit it contains.

#For example, 128 is a self-dividing number because 128 % 1 == 0, 128 % 2 == 0, and 128 % 8 == 0.
#A self-dividing number is not allowed to contain the digit zero.

#Given two integers left and right, return a list of all the self-dividing numbers in the range [left, #right].



# left, right = 1, 22
#Output: [1,2,3,4,5,6,7,8,9,11,12,15,22]

#Example 2:
left,right = 47,85
#Output: [48,55,66,77]

def selfDivingNumber(lef, riht):
    output = []
    for num in range(lef,riht+1):
        str_num = str(num)
        seen = set()
        for char in str_num:
            if char in seen:
                continue
            seen.add(char)
            if char=='0' or num % int(char):
                break
        else:
            output.append(num)
    return output


print(selfDivingNumber(left,right))