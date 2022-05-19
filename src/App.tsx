import React, { useEffect, useState } from "react";
import Button from "./components/Container";
import Container from "./components/Container";
import Text from "./components/Text";
import { useParams, useNavigate } from "react-router-dom";
import Input from "./components/Input";
import { io } from "socket.io-client";

type IPlayer = {
  playerName?: string;
  choice?: "Circle" | "X";
  wins?: number;
};

type Props = {
  socket: any;
};

const App: React.FC<Props> = (props: Props) => {
  const [firstPlayer, setFirstPlayer] = useState<IPlayer>();
  const [secondPlayer, setSecondPlayer] = useState<IPlayer>();
  const [turn, setTurn] = useState<IPlayer | undefined>(undefined);
  const [winner, setWinner] = useState<{ player: IPlayer; index: number }[]>();
  const [thisPlayer, setThisPlayer] = useState<IPlayer>();
  const [ties, setTies] = useState(0);
  const [inputValue, setInputValue] = useState<string | undefined>();
  const [inputValueJoin, setInputValueJoin] = useState("");
  const [selectedChoice, setSelectedChoice] =
    useState<IPlayer["choice"]>("Circle");
  const [positions, setPositions] = useState<
    [
      IPlayer,
      IPlayer,
      IPlayer,
      IPlayer,
      IPlayer,
      IPlayer,
      IPlayer,
      IPlayer,
      IPlayer
    ]
  >([{}, {}, {}, {}, {}, {}, {}, {}, {}]);
  const { id } = useParams();
  const history = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  window.addEventListener("resize", () =>
    setIsMobile(window.innerWidth <= 800)
  );

  const { socket } = props;

  type Args = {
    key: string;
    firstPlayerServer?: IPlayer;
    secondPlayerServer?: IPlayer;
    turn: IPlayer;
    positionsServer: [
      IPlayer,
      IPlayer,
      IPlayer,
      IPlayer,
      IPlayer,
      IPlayer,
      IPlayer,
      IPlayer,
      IPlayer
    ];
  };
  // receive a message from the server
  socket.on(id?.toString() || "", (...args: Args[]) => {
    setWinner(undefined);

    try {
      if (args[0]) {
        const { firstPlayerServer, secondPlayerServer, positionsServer } =
          args[0];

        setTurn(args[0].turn);

        if (!firstPlayer && firstPlayerServer) {
          setFirstPlayer(firstPlayerServer);
        }

        if (!secondPlayer && secondPlayerServer) {
          setSecondPlayer(secondPlayerServer);
        }

        if (positionsServer !== positions && positionsServer) {
          setPositions(positionsServer);
        }
      }
    } catch (err) {
      console.log("Ocorreu um erro ao atualizar as variáveis locais ", err);
    }
  });

  socket.on("returnInitialState", (...args: Args[]) => {
    if (args[0]) {
      const { firstPlayerServer, secondPlayerServer, positionsServer } =
        args[0];
      console.log("Alguém já criou a sala.");
      setFirstPlayer(firstPlayerServer ? firstPlayerServer : undefined);
      setSecondPlayer(secondPlayerServer ? secondPlayerServer : undefined);

      setTurn(args[0].turn);

      if (positionsServer !== positions && positionsServer) {
        setPositions(positionsServer);
      }
    }
  });

  useEffect(() => {
    if (id) {
      socket.emit("getInitialState", id?.toString());
    }
  }, [id]);

  const setNewPlayer = () => {
    let newFirstPlayer: IPlayer | undefined = undefined;
    let newSecondPlayer: IPlayer | undefined = undefined;

    if (!firstPlayer) {
      newFirstPlayer = {
        playerName: inputValue || "",
        choice: "X",
        wins: 0,
      };
    } else {
      newSecondPlayer = {
        playerName: inputValue,
        choice: "Circle",
        wins: 0,
      };
    }

    if (id) {
      socket.emit("clientEvent", {
        key: id,
        firstPlayerServer: newFirstPlayer,
        secondPlayerServer: newSecondPlayer,
      });
    }

    if (newFirstPlayer) {
      setFirstPlayer(newFirstPlayer);
    }
    if (newSecondPlayer) {
      setSecondPlayer(newSecondPlayer);
    }

    setThisPlayer(
      [newFirstPlayer, newSecondPlayer].find(
        (value) => value?.playerName === inputValue
      )
    );
    setInputValue("AlredySelected");
  };

  const CheckIfWins = (newP?: IPlayer[]) => {
    //Check horizontal
    const toMap = newP ? newP : positions;

    toMap.map((value, index) => {
      let Elements = [];
      if (!winner) {
        if (index === 0 || index === 3 || index === 6) {
          for (let h = index; h <= index + 2; h++) {
            Elements.push({ player: toMap[h], index: h });
          }

          if (
            Elements.every(
              (val, i, arr) =>
                val.player.playerName === arr[0].player.playerName &&
                Object.keys(val.player).length >= 1
            )
          ) {
            setWinner(Elements);
          }
        }
        Elements = [];

        //Check vertical
        if (index === 0 || index === 1 || index === 2) {
          for (let h = index; h <= index + 6; h = h + 3) {
            Elements.push({ player: toMap[h], index: h });
          }
          if (
            Elements.every(
              (val, i, arr) =>
                val.player.playerName === arr[0].player.playerName &&
                Object.keys(val.player).length >= 1
            )
          ) {
            setWinner(Elements);
          }
        }
        Elements = [];

        //Check 45
        if (index === 0) {
          for (let h = index; h <= index + 8; h = h + 4) {
            Elements.push({ player: toMap[h], index: h });
          }
          if (
            Elements.every(
              (val, i, arr) =>
                val.player.playerName === arr[0].player.playerName &&
                Object.keys(val.player).length >= 1
            )
          ) {
            setWinner(Elements);
          }
        }
        Elements = [];

        //Check 90
        if (index === 2) {
          for (let h = index; h <= index + 5; h = h + 2) {
            Elements.push({ player: toMap[h], index: h });
          }
          if (
            Elements.every(
              (val, i, arr) =>
                val.player.playerName === arr[0].player.playerName &&
                Object.keys(val.player).length >= 1
            )
          ) {
            setWinner(Elements);
          }
        }
      }
    });
  };

  useEffect(() => {
    if (firstPlayer && secondPlayer && positions) {
      if (!id) {
        const newTurn = turn === firstPlayer ? secondPlayer : firstPlayer;

        if (
          firstPlayer &&
          secondPlayer?.playerName === "CPU" &&
          newTurn?.playerName === "CPU" &&
          !id
        ) {
          const newRandomNumber = () => {
            const randomNumber = parseInt(
              (Math.random() * (8 - 0) + 0).toString()
            );

            if (Object.keys(positions[randomNumber]).length >= 1) {
              newRandomNumber();
            } else {
              let newArr = positions;
              newArr[randomNumber] = secondPlayer;
              setPositions([...newArr]);
              setTurn(newTurn);
            }
          };
          newRandomNumber();
        } else {
          if (turn) {
            setTurn(newTurn);
          }
        }
      }
      CheckIfWins();
    }
  }, [positions]);

  useEffect(() => {
    if (winner && firstPlayer && secondPlayer) {
      winner[0].player.playerName === firstPlayer.playerName
        ? setFirstPlayer({
            ...firstPlayer,
            wins: firstPlayer.wins ? firstPlayer.wins + 1 : 1,
          })
        : setSecondPlayer({
            ...secondPlayer,
            wins: secondPlayer.wins ? secondPlayer.wins + 1 : 1,
          });
    }
  }, [winner]);

  useEffect(() => {
    if (firstPlayer && !turn && !id) {
      setTurn(firstPlayer);
    }
  }, [firstPlayer]);

  type IconsProps = {
    scale: string;
    background: string;
  };

  const CircleIcon: React.FC<IconsProps> = (props: IconsProps) => {
    return (
      <Container
        height={props.scale}
        width={props.scale}
        borderRadius={"50%"}
        background={props.background}
        justifyContent={"center"}
        alignItems="center"
      >
        <Container
          height={"50%"}
          width={"50%"}
          borderRadius={"50%"}
          background={"#1F3540"}
        />
      </Container>
    );
  };

  const XIcon: React.FC<IconsProps> = (props: IconsProps) => {
    return (
      <Container
        height={props.scale}
        width={props.scale}
        justifyContent={"center"}
        alignItems="center"
        position={"relative"}
      >
        <Container
          position={"absolute"}
          height={"100%"}
          width={"20%"}
          borderRadius={"4px"}
          background={props.background}
          transform={"rotate(-45deg)"}
        />
        <Container
          position={"absolute"}
          height={"100%"}
          width={"20%"}
          borderRadius={"4px"}
          background={props.background}
          transform={"rotate(45deg)"}
        />
      </Container>
    );
  };

  return (
    <Container
      width={"100%"}
      height={"100%"}
      background={"#192A32"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Container width={"500px"} height={"515"} flexDirection={"column"}>
        <Container
          width={"100%"}
          height={"38px"}
          marginBottom={"22px"}
          display={"grid"}
          gridTemplateColumns={"1fr 1fr 1fr"}
          gap={"18px"}
        >
          <Container width={"76px"} height={"100%"}>
            <Container flex={"1"} height={"100%"} alignItems="center">
              <XIcon scale="90%" background="#31C4BE" />
            </Container>
            <Container flex={"1"} height={"100%"} alignItems="center">
              <CircleIcon scale="90%" background="#F2B237" />
            </Container>
          </Container>
          <Container
            width={"154px"}
            height={"100%"}
            background={"#1F3540"}
            borderRadius={"8px"}
            boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25);"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            {turn && (
              <>
                {turn.choice === "Circle" ? (
                  <CircleIcon scale="20px" background="#8197A1" />
                ) : (
                  <XIcon scale="20px" background="#8197A1" />
                )}
              </>
            )}

            <Text color="#8197A1" fontSize={"18px"} marginLeft={"8px"}>
              TURN
            </Text>
          </Container>
          <Container justifyContent={"flex-end"}>
            <Container
              background={"#A8BEC9"}
              width={"38px"}
              height={"100%"}
              borderRadius={"8px"}
              onClick={() => {
                setPositions([{}, {}, {}, {}, {}, {}, {}, {}, {}]);
                if (id) {
                  socket.emit("clientEvent", {
                    key: id,
                    firstPlayerServer: firstPlayer,
                    secondPlayerServer: secondPlayer,
                    turn: undefined,
                    positionsServer: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
                  });
                }
              }}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Text color="#1F3540" fontSize={"18px"}>
                R
              </Text>
            </Container>
          </Container>
        </Container>

        <Container
          display={"grid"}
          gridTemplateColumns={"1fr 1fr 1fr"}
          gap={"18px"}
        >
          {positions.map((position, key) => (
            <Container
              key={key}
              width={"100%"}
              height={"154px"}
              background={
                winner?.find((value) => value.index === key)
                  ? winner[0].player.choice === "X"
                    ? "#31C4BE"
                    : "#F2B237"
                  : "#1F3540"
              }
              borderRadius={"8px"}
              boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25);"}
              justifyContent={"center"}
              alignItems={"center"}
              onClick={() => {
                if (!turn && thisPlayer) {
                  let newArr = positions;
                  newArr[key] = thisPlayer;
                  setPositions([...newArr]);

                  const newTurn =
                    thisPlayer.playerName === firstPlayer?.playerName
                      ? secondPlayer
                      : firstPlayer;

                  if (id) {
                    socket.emit("clientEvent", {
                      key: id,
                      firstPlayerServer: firstPlayer,
                      secondPlayerServer: secondPlayer,
                      turn: newTurn,
                      positionsServer: [...newArr],
                    });
                  }
                }

                if (
                  positions[key]?.playerName !== firstPlayer?.playerName &&
                  positions[key]?.playerName !== secondPlayer?.playerName &&
                  turn &&
                  (id ? thisPlayer?.playerName === turn.playerName : true)
                ) {
                  let newArr = positions;
                  newArr[key] = turn;
                  setPositions([...newArr]);

                  const newTurn =
                    turn.playerName === firstPlayer?.playerName
                      ? secondPlayer
                      : firstPlayer;

                  if (id) {
                    socket.emit("clientEvent", {
                      key: id,
                      firstPlayerServer: firstPlayer,
                      secondPlayerServer: secondPlayer,
                      turn: newTurn,
                      positionsServer: [...newArr],
                    });
                  }
                }
              }}
            >
              {position?.choice === "Circle" ? (
                <CircleIcon
                  scale="60%"
                  background={
                    winner && winner[0].player.choice === "Circle"
                      ? "#1F3540"
                      : "#F2B237"
                  }
                />
              ) : position.choice === "X" ? (
                <XIcon
                  scale="60%"
                  background={
                    winner && winner[0].player.choice === "X"
                      ? "#1F3540"
                      : "#31C4BE"
                  }
                />
              ) : (
                <></>
              )}
            </Container>
          ))}
        </Container>

        <Container height={"65px"} width={"100%"} marginTop={"22px"}>
          <Container
            flex={1}
            marginRight={"18px"}
            background={"#31C4BE"}
            borderRadius={"8px"}
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={"column"}
            overflow={"hidden"}
          >
            <Text color="#1F3540" fontSize={"14px"}>
              X ({" "}
              {firstPlayer?.choice === "X"
                ? firstPlayer?.playerName
                : secondPlayer?.playerName}{" "}
              )
            </Text>
            <Text color="#1F3540" fontSize={"22px"}>
              {firstPlayer?.choice === "X"
                ? firstPlayer?.wins
                : secondPlayer?.wins}
            </Text>
          </Container>
          <Container
            flex={1}
            marginRight={"18px"}
            background={"#A8BEC9"}
            borderRadius={"8px"}
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={"column"}
          >
            <Text color="#1F3540" fontSize={"14px"}>
              TIES
            </Text>
            <Text color="#1F3540" fontSize={"22px"}>
              {ties + 1}
            </Text>
          </Container>
          <Container
            flex={1}
            background={"#F2B237"}
            borderRadius={"8px"}
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={"column"}
            overflow={"hidden"}
          >
            <Text color="#1F3540" fontSize={"14px"}>
              O ({" "}
              {firstPlayer?.choice === "Circle"
                ? firstPlayer?.playerName
                : secondPlayer?.playerName}{" "}
              )
            </Text>
            <Text color="#1F3540" fontSize={"22px"}>
              {firstPlayer?.choice === "Circle"
                ? firstPlayer?.wins
                : secondPlayer?.wins}
            </Text>
          </Container>
        </Container>
      </Container>

      <Container
        position={"absolute"}
        width={"100vw"}
        height={"100vh"}
        background={"#192A32"}
        alignItems={"center"}
        justifyContent={"center"}
        overflow={"hidden"}
        maxWidth={!firstPlayer || !secondPlayer ? "100vw" : "0vw"}
        flexDirection={"column"}
      >
        {id && (
          <Text fontSize={"52px"} color={"#A8BEC9"} marginBottom={"32px"}>
            Room {id}
          </Text>
        )}

        {!id && (
          <Container marginBottom={"24px"}>
            <XIcon scale={"40px"} background={"#33C2BF"} />
            <CircleIcon scale={"40px"} background={"#F2B237"} />
          </Container>
        )}
        <Container
          width={isMobile ? "308px" : "480px"}
          padding={"24px"}
          background={"#1F3540"}
          borderRadius={"8px"}
          alignItems={"center"}
          justifyContent={"center"}
          flexDirection={"column"}
        >
          {id ? (
            <>
              <Container marginBottom={"24px"}>
                {firstPlayer || secondPlayer ? (
                  <>
                    {[firstPlayer, secondPlayer].map((value, index) => (
                      <Container key={index}>
                        {value && (
                          <>
                            <Container
                              flexDirection={"column"}
                              alignItems={"center"}
                            >
                              <Container
                                height={"48px"}
                                width={"48px"}
                                borderRadius={"50%"}
                                alignItems={"center"}
                                justifyContent={"center"}
                              >
                                {value.choice === "Circle" ? (
                                  <CircleIcon
                                    scale={"40px"}
                                    background={"#F2B237"}
                                  />
                                ) : (
                                  <XIcon
                                    scale={"40px"}
                                    background={"#33C2BF"}
                                  />
                                )}
                              </Container>
                              <Text
                                fontSize={"18px"}
                                color={"#ffffff"}
                                marginTop={"8px"}
                              >
                                {value?.playerName || "Não definido"}
                              </Text>
                            </Container>
                          </>
                        )}
                      </Container>
                    ))}
                  </>
                ) : (
                  <Text fontSize={"18px"} color={"#d1d0d0"} marginTop={"8px"}>
                    Ninguém entrou ainda =(
                  </Text>
                )}
              </Container>
              {(!firstPlayer || !secondPlayer) &&
                inputValue !== "AlredySelected" && (
                  <Container>
                    <Input
                      onChange={(event) => {
                        setInputValue(event.target.value);
                      }}
                    />
                    <Button
                      background={"#F2B237"}
                      padding={"12px"}
                      borderRadius={"8px"}
                      boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25);"}
                      width={"48px"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      onClick={setNewPlayer}
                      marginLeft={"12px"}
                    >
                      <Text fontSize={"18px"} color={"#1D323D"}>
                        Entrar
                      </Text>
                    </Button>
                  </Container>
                )}
            </>
          ) : (
            <>
              <Text fontSize={"14px"} color={"#A8BEC9"} marginBottom={"18px"}>
                PICK PLAYER 1'S MARK
              </Text>

              <Container
                background={"#192A32"}
                borderRadius={"8px"}
                width={"100%"}
                height={"58px"}
                padding={"8px"}
                marginBottom={"18px"}
              >
                <Container
                  flex={1}
                  background={selectedChoice === "X" ? "#A8BEC9" : "#192A32"}
                  borderRadius={"8px"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  onClick={() => setSelectedChoice("X")}
                >
                  <XIcon
                    background={selectedChoice === "X" ? "#192A32" : "#A8BEC9"}
                    scale={"42px"}
                  />
                </Container>
                <Container
                  flex={1}
                  background={
                    selectedChoice === "Circle" ? "#A8BEC9" : "#192A32"
                  }
                  borderRadius={"8px"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  onClick={() => setSelectedChoice("Circle")}
                >
                  <CircleIcon
                    background={
                      selectedChoice === "Circle" ? "#192A32" : "#A8BEC9"
                    }
                    scale={"42px"}
                  />
                </Container>
              </Container>

              <Text fontSize={"10px"} color={"#A8BEC9"}>
                REMEMBER X GOES FIRST
              </Text>
            </>
          )}
        </Container>

        {!id && (
          <>
            <Button
              background={"#F2B237"}
              padding={"12px"}
              borderRadius={"8px"}
              boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25);"}
              width={isMobile ? "308px" : "502px"}
              alignItems={"center"}
              justifyContent={"center"}
              marginTop={"24px"}
              onClick={() => {
                setFirstPlayer({
                  choice: selectedChoice,
                  playerName: "Player 1",
                  wins: 0,
                });

                setSecondPlayer({
                  choice: selectedChoice === "X" ? "Circle" : "X",
                  playerName: "CPU",
                  wins: 0,
                });
              }}
            >
              <Text fontSize={"18px"} color={"#1D323D"}>
                LOCAL VS CPU
              </Text>
            </Button>

            <Button
              background={"#33C2BF"}
              padding={"12px"}
              borderRadius={"8px"}
              boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25);"}
              width={isMobile ? "308px" : "502px"}
              alignItems={"center"}
              justifyContent={"center"}
              marginTop={"24px"}
              onClick={() => {
                setFirstPlayer({
                  choice: selectedChoice,
                  playerName: "Player 1",
                  wins: 0,
                });

                setSecondPlayer({
                  choice: selectedChoice === "X" ? "Circle" : "X",
                  playerName: "Player 2",
                  wins: 0,
                });
              }}
            >
              <Text fontSize={"18px"} color={"#1D323D"}>
                LOCAL VS LOCAL
              </Text>
            </Button>

            <Button
              background={"#54c233"}
              padding={"12px"}
              borderRadius={"8px"}
              boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25);"}
              width={isMobile ? "308px" : "502px"}
              alignItems={"center"}
              justifyContent={"center"}
              marginTop={"24px"}
              onClick={() =>
                history(
                  "/Tic-Tac-Toe/" +
                    Math.floor(Math.random() * 16777215).toString(16)
                )
              }
            >
              <Text fontSize={"18px"} color={"#1D323D"}>
                NEW GAME ONLINE
              </Text>
            </Button>

            <Text fontSize={"16px"} color={"#ffffff"} marginTop={"32px"}>
              Alredy have a room? Enter
            </Text>

            <Container marginTop={"12px"} width={isMobile ? "308px" : "502px"}>
              <Input
                onChange={(event) => setInputValueJoin(event.target.value)}
              />
              <Button
                background={"#8e33c2"}
                padding={"12px"}
                borderRadius={"8px"}
                boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25);"}
                width={"128px"}
                alignItems={"center"}
                justifyContent={"center"}
                marginLeft={"12px"}
                onClick={() => history("/Tic-Tac-Toe/" + inputValueJoin)}
              >
                <Text fontSize={"18px"} color={"#ffffff"}>
                  JOIN
                </Text>
              </Button>
            </Container>
          </>
        )}
      </Container>

      <Container
        position={"absolute"}
        width={"100vw"}
        height={"100vh"}
        background={"rgba(0, 0, 0, 0.3)"}
        alignItems={"center"}
        justifyContent={"center"}
        overflow={"hidden"}
        maxWidth={winner ? "100vw" : "0vw"}
      >
        <Container
          background={"#1F3540"}
          width={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
          flexDirection={"column"}
          padding={"52px"}
        >
          <Text fontSize={"18px"} color={"#8197A1"} marginBottom={"24px"}>
            {winner && winner[0].player.playerName?.toUpperCase()} WON THIS
            ROUND!
          </Text>
          <Container
            width={"100%"}
            alignItems="center"
            justifyContent={"center"}
            marginBottom={"24px"}
          >
            {winner && winner[0].player.choice === "X" ? (
              <XIcon scale="70px" background="#33C2BF" />
            ) : (
              <CircleIcon scale="70px" background="#F2B237" />
            )}
            <Text
              fontSize={"48px"}
              color={
                winner && winner[0].player.choice === "X"
                  ? "#33C2BF"
                  : "#F2B237"
              }
              marginLeft={"18px"}
            >
              TAKES THE ROUND
            </Text>
          </Container>

          <Container>
            <Button
              marginRight={"16px"}
              background={"#8197A1"}
              padding={"12px"}
              borderRadius={"8px"}
              boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25);"}
              onClick={() => {
                setWinner(undefined);
                setFirstPlayer(undefined);
                setSecondPlayer(undefined);
                history("/Tic-Tac-Toe/");
              }}
            >
              <Text fontSize={"18px"} color={"#1D323D"}>
                QUIT
              </Text>
            </Button>
            <Button
              background={"#F5B43B"}
              padding={"12px"}
              borderRadius={"8px"}
              boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25);"}
              onClick={() => {
                setWinner(undefined);
                setPositions([{}, {}, {}, {}, {}, {}, {}, {}, {}]);
                setTies(ties + 1);

                if (id) {
                  socket.emit("clientEvent", {
                    key: id,
                    firstPlayerServer: firstPlayer,
                    secondPlayerServer: secondPlayer,
                    turn: undefined,
                    positionsServer: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
                  });
                }
              }}
            >
              <Text fontSize={"18px"} color={"#1D323D"}>
                NEXT ROUND
              </Text>
            </Button>
          </Container>
        </Container>
      </Container>

      <Container
        position={"absolute"}
        bottom={16}
        right={16}
        onClick={() => {}}
      >
        <Text fontSize={"14px"} color={"#8197A1"}>
          Como jogar?
        </Text>
      </Container>
    </Container>
  );
};

export default App;
