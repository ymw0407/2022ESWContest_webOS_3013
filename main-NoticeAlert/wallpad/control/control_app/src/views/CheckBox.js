import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './CheckBox.css';
import LS2Request from '@enact/webos/LS2Request';

const bridge = new LS2Request();

const StyledTable = styled.table`
  text-align: center;
  border-collapse: collapse;
  tbody{
    tr{
      td{
        padding: 10px 10px;
        border-bottom: 5px solid #eee;
        color: white;
        font-size: 25px;
        font-weight: 700;
      }
    }
  }
  .second-row{
    width: 100px;
  }
`;

export default function CheckBox() {
  const data = [
    {id: 1, name:"blind", title: '1단계'},
    {id: 2, name:"blind", title: '2단계'},
    {id: 3, name:"blind", title: '3단계'},
    {id: 4, name:"blind", title: '4단계'},
    {id: 5, name:"blind", title: '5단계'},
  ];

  function blindPublishService(id){
		let blind = {state: id}
		console.log(blind);
		var lsRequest = {
			service:"luna://com.control.app.service",
			method:"blind",
			parameters: {"blind" : blind},
			onSuccess: (msg) => {
				console.log(msg.message);
			},
			onFailure: (msg) => {console.log(msg);console.log("error");},
		}
		bridge.send(lsRequest);
	}

  // 체크된 아이템을 담을 배열
  const [checkItems3, setCheckItems3] = useState([]);

  // 체크박스 단일 선택
  const handleSingleCheck = (checked3, id) => {
    if (checked3) {
      // 단일 선택 시 체크된 아이템을 배열에 추가
      setCheckItems3(prev => [...prev, id]);
      console.log(checkItems3)
      console.log(setCheckItems3)
    } else {
      // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
      setCheckItems3(checkItems3.filter((el) => el !== id));
      blindPublishService(id)
    }
  };

  const onlyOne = (target3) => {
    document.querySelectorAll(`input[type=checkbox]`)
        .forEach(el => el.checked = false);
    target3.checked = true;
  }


  return (
    <StyledTable>
      <div className='tem'>
        <tbody>
          {data?.map((data, key) => (
            <tr key={key}>
              <td>
                <input type='checkbox' name={`select-${data.name}`}
                  onClick={(e) => onlyOne(e.target)}
                  onChange={(e) => handleSingleCheck(e.target.checked3, data.id)}
                  // 체크된 아이템 배열에 해당 아이템이 있을 경우 선택 활성화, 아닐 시 해제
                  checked3={checkItems3.includes(data.id) ? true : false} />
              </td>
              <td className='second-row'>{data.title}</td>
            </tr>
          ))}
        </tbody>
      </div>
    </StyledTable>
  )
}