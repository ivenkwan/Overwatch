import csv
import random
from datetime import datetime, timedelta

def generate_csv():
    headers = ["customer num","txn_date","txn_ref_no","Counterparties","txn_country","txn_currency","txn currency_amount","txn_amount_in_hkd","cdi_code","Txn Type"]
    data = []
    
    ref_no = 1
    base_date = datetime(2026, 4, 8)
    
    # 1. Circular Transaction Detection (A -> B -> C -> A)
    cust_a = "1111111111"
    cust_b = "2222222222"
    cust_c = "3333333333"
    
    # A -> B
    data.append([cust_a, base_date.strftime("%Y-%m-%d %H:%M:%S"), ref_no, cust_b, "HKG", "HKD", "50000", "50000", "D", "TRANSFER_P2P"])
    ref_no += 1
    data.append([cust_b, base_date.strftime("%Y-%m-%d %H:%M:%S"), ref_no, cust_a, "HKG", "HKD", "50000", "50000", "C", "TRANSFER_P2P"])
    ref_no += 1
    
    # B -> C
    data.append([cust_b, (base_date + timedelta(hours=1)).strftime("%Y-%m-%d %H:%M:%S"), ref_no, cust_c, "HKG", "HKD", "50000", "50000", "D", "TRANSFER_P2P"])
    ref_no += 1
    data.append([cust_c, (base_date + timedelta(hours=1)).strftime("%Y-%m-%d %H:%M:%S"), ref_no, cust_b, "HKG", "HKD", "50000", "50000", "C", "TRANSFER_P2P"])
    ref_no += 1
    
    # C -> A
    data.append([cust_c, (base_date + timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S"), ref_no, cust_a, "HKG", "HKD", "50000", "50000", "D", "TRANSFER_P2P"])
    ref_no += 1
    data.append([cust_a, (base_date + timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S"), ref_no, cust_c, "HKG", "HKD", "50000", "50000", "C", "TRANSFER_P2P"])
    ref_no += 1


    # 2. Smurfing Detection
    # Many deposits just below 10,000 threshold to one account
    target_smurf = "4444444444"
    for i in range(10):
        sender = f"{5555555555 + i}"
        amount = 9900 + random.randint(-50, 50)
        data.append([sender, base_date.strftime("%Y-%m-%d %H:%M:%S"), ref_no, target_smurf, "HKG", "HKD", str(amount), str(amount), "D", "TRANSFER_P2P"])
        ref_no += 1
        data.append([target_smurf, base_date.strftime("%Y-%m-%d %H:%M:%S"), ref_no, sender, "HKG", "HKD", str(amount), str(amount), "C", "TRANSFER_P2P"])
        ref_no += 1

    
    # 3. Rapid Movement Detection
    # Money comes in and goes out immediately
    rapid_target = "6666666666"
    sender_rapid = "7777777777"
    receiver_rapid = "8888888888"
    
    # Money comes in
    t_in = base_date + timedelta(hours=4)
    data.append([sender_rapid, t_in.strftime("%Y-%m-%d %H:%M:%S"), ref_no, rapid_target, "HKG", "HKD", "100000", "100000", "D", "TRANSFER_P2P"])
    ref_no += 1
    data.append([rapid_target, t_in.strftime("%Y-%m-%d %H:%M:%S"), ref_no, sender_rapid, "HKG", "HKD", "100000", "100000", "C", "TRANSFER_P2P"])
    ref_no += 1
    
    # Money goes out 1 minute later
    t_out = t_in + timedelta(minutes=1)
    data.append([rapid_target, t_out.strftime("%Y-%m-%d %H:%M:%S"), ref_no, receiver_rapid, "HKG", "HKD", "99900", "99900", "D", "TRANSFER_P2P"])
    ref_no += 1
    data.append([receiver_rapid, t_out.strftime("%Y-%m-%d %H:%M:%S"), ref_no, rapid_target, "HKG", "HKD", "99900", "99900", "C", "TRANSFER_P2P"])
    ref_no += 1

    # Adding some normal noise transactions
    for i in range(50):
        sender = f"{1000000000 + i}"
        receiver = f"{9000000000 + i}"
        amount = random.randint(10, 2000)
        data.append([sender, base_date.strftime("%Y-%m-%d %H:%M:%S"), ref_no, receiver, "HKG", "HKD", str(amount), str(amount), "D", "TRANSFER_P2P"])
        ref_no += 1
        data.append([receiver, base_date.strftime("%Y-%m-%d %H:%M:%S"), ref_no, sender, "HKG", "HKD", str(amount), str(amount), "C", "TRANSFER_P2P"])
        ref_no += 1

    file_path = "c:\\Repo\\Overwatch\\input_data\\20260408_CUST_TNG.csv"
    with open(file_path, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(data)
        
    print(f"Successfully generated {file_path}")

if __name__ == "__main__":
    generate_csv()
