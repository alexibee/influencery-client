import { useState, useEffect } from "react";
import InfluencerCard from "./Card";
import styled from "styled-components";

const InfluencerSearch = () => {
  const [influencers, setInfluencers] = useState();
  const [searchString, setSearchString] = useState("");
  const [platformString, setPlatformString] = useState("all");
  const [followerCount, setFollowerCount] = useState("");

  useEffect(() => {
    getInfluencers();
  }, []);

  const getInfluencers = () =>
    fetch("http://localhost:3000/api/v1/influencers", {
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setInfluencers(data));

  const maxFollowers = () => {
    const infl = []
    influencers?.forEach(inf => infl.push(inf['followers']))
    return Math.max(...infl)
  }
  const filtered = () => {
    const firstFiltered = influencers?.filter((inf) => (
      [inf['handle'], inf['platform']['name'], inf['primary_tag']['name']].join(' ').toLowerCase().includes(searchString.toLowerCase())
    ))

    let secondFiltered = influencers?.filter((inf) => (
      inf['tags'].map((tag) => (tag['name'])).join(' ').toLowerCase().includes(searchString.toLowerCase())
    ))

    secondFiltered = secondFiltered?.filter((inf) => (
      !firstFiltered.includes(inf)
    ))

    if(firstFiltered?.concat(secondFiltered)){
      return firstFiltered?.concat(secondFiltered)
    } else {
      return influencers
    }
  }

  const platformFiltered = () => {
    if(platformString.toLowerCase() !== "all") {
      return filtered()?.filter((inf) => (
        inf['platform']['name'].toLowerCase() === platformString.toLowerCase()
      ))
    } else {
      return filtered()
    }
  }

  const followerFiltered = () => {
    if(followerCount !== "") {
      return platformFiltered()?.filter((inf) => (
        inf['followers'] <= followerCount
      ))
    } else {
      return platformFiltered()
    }
  }

  return (
    <div>
      <SearchInputContainer>
        <SearchInput
          placeholder="Enter influencer handle, platform, or tag"
          type="text"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <SelectInput
          value={platformString}
          onChange={(e) => setPlatformString(e.target.value)}
          name="platforms"
          id="platforms"
        >
          <option value="all">All</option>
          <option value="instagram">Instagram</option>
          <option value="twitter">Twitter</option>
          <option value="facebook">Facebook</option>
          <option value="tiktok">Tik-Tok</option>
          <option value="youtube">Youtube</option>
        </SelectInput>
        <RangeInputContainer>
          <label for="followersRange">Filter by follower count</label>
          <div>
            0
            <RangeInput
              type='range'
              min={0}
              max={maxFollowers()}
              step={100}
              onChange={(e) => setFollowerCount(e.target.value)}
              value={followerCount}
              name="followersRange"
              id="followersRange"
            />
            {(followerCount) ? followerCount : "max" }
          </div>
          </RangeInputContainer>
      </SearchInputContainer>
      <SearchContainer>
        {!influencers && <Loader />}
        <div>
        {followerFiltered()?.map((inf, i) => (
            <InfluencerCard influencer={inf} key={"inf_card_" + i} />
          ))}
        </div>
      </SearchContainer>
    </div>
  );
};


const RangeInputContainer = styled.div`
color: grey;
font-size: 0.6rem;
  div {
    display: block;
  }
  label {
    font-size: 0.7rem;
  }
`;

const RangeInput = styled.input`
`;


const SelectInput = styled.select`
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
  border: 2px solid #2d9fd9;
  color: grey;
  width: 100px;
  height: 35px;
  padding-left: 10px;
  &:focus {
    outline: none;
    border: 2px solid #ee7622;
    color: grey;
  }
  margin: 10px;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 70px 20vw 30px 20vw;
`;

const Loader = styled.div`
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: loader-spin 2s linear infinite;
  position: absolute;
  top: 45vh;
`;

const SearchInput = styled.input`
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
  border: 2px solid #2d9fd9;
  color: grey;
  width: 300px;
  height: 30px;
  padding-left: 20px;
  &:focus {
    outline: none;
    border: 2px solid #ee7622;
    color: grey;
  }
  margin: 10px;
`;

const SearchInputContainer = styled.div`
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
  z-index: 1000;
`;

export default InfluencerSearch;
